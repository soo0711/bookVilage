import os
from models import Reviews, Topics
from lda_topic_modeler import LDATopicModeler
from database import get_db


def process_and_save_topics():
    """
    리뷰 데이터를 기반으로 LDA 모델을 학습하고, WordCloud를 생성하여 저장.
    """
    db = next(get_db())
    lda_modeler = LDATopicModeler(num_topics=10)
    output_dir = "topic_wordclouds"
    os.makedirs(output_dir, exist_ok=True)

    # 모든 리뷰 가져오기
    reviews = db.query(Reviews.isbn13, Reviews.review_content).all()
    print(f"Loaded {len(reviews)} reviews from the database")

    # ISBN별 리뷰 그룹화
    grouped_reviews = {}
    for isbn, review in reviews:
        grouped_reviews.setdefault(isbn, []).append(review)

    for isbn, review_list in grouped_reviews.items():
        try:
            review_list = [r for r in review_list if r and r.strip()]
            if not review_list:
                print(f"Skipping ISBN {isbn}: No valid reviews after preprocessing.")
                continue

            # LDA 학습 및 WordCloud 생성
            lda_model, dictionary, corpus = lda_modeler.train_lda(review_list)
            wordcloud_path = os.path.join(output_dir, f"{isbn}.png")
            lda_modeler.generate_wordcloud(
                lda_model, dictionary, corpus, wordcloud_path
            )

            # 토픽 저장
            for topic_id, words in enumerate(
                lda_model.show_topics(num_words=10, formatted=False)
            ):
                db.add(
                    Topics(
                        isbn13=isbn,
                        topic_id=topic_id,
                        keywords=", ".join([word for word, _ in words]),
                        wordcloud_url=wordcloud_path,
                    )
                )
            db.commit()
        except ValueError as e:
            print(f"Skipping ISBN {isbn}: {e}")
        except Exception as e:
            print(f"Error processing ISBN {isbn}: {e}")


if __name__ == "__main__":
    process_and_save_topics()
