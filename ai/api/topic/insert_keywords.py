from sqlalchemy.orm import Session
from sqlalchemy import select, insert
from utils import load_stopwords, preprocess_review, extract_nouns
from lda_analysis import perform_lda

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from database import get_db
from models import Reviews, Keywords, KeywordReviews


# 모든 ISBN13에 대한 키워드와 키워드-리뷰 매핑 저장
def process_all_reviews():
    db = next(get_db())
    try:
        # 모든 ISBN13 가져오기
        isbn13_list = db.execute(select(Reviews.isbn13).distinct()).scalars().all()

        if not isbn13_list:
            print("No reviews found in the database.")
            return

        stopwords = load_stopwords()

        for isbn13 in isbn13_list:
            print(f"Processing ISBN13: {isbn13}")

            # 해당 ISBN13에 대한 리뷰 가져오기
            reviews = (
                db.execute(select(Reviews).where(Reviews.isbn13 == isbn13))
                .scalars()
                .all()
            )
            if not reviews:
                print(f"No reviews found for ISBN13: {isbn13}")
                continue

            # 리뷰 전처리
            processed_reviews = [
                extract_nouns(preprocess_review(review.review_content), stopwords)
                for review in reviews
            ]
            # 빈 리뷰 확인
            if not any(processed_reviews):
                print(f"No valid content for ISBN13: {isbn13}")
                continue

            # LDA 분석 수행
            _, word_weights = perform_lda(reviews, stopwords)

            # 키워드 저장
            for word, freq in word_weights.items():
                db.execute(
                    insert(Keywords).values(isbn13=isbn13, keyword=word, frequency=freq)
                )

            # 키워드-리뷰 매핑 저장
            for review, tokens in zip(reviews, processed_reviews):
                for token in tokens:
                    db.execute(
                        insert(KeywordReviews).values(
                            isbn13=isbn13, keyword=token, review_id=review.id
                        )
                    )

            db.commit()
            print(f"Finished processing ISBN13: {isbn13}")
    finally:
        db.close()


if __name__ == "__main__":
    process_all_reviews()
