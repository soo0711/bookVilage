from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
from recommend import PrecomputedRecommender
from models import Book, Reviews, BookRegister, Keywords, KeywordReviews
from config import DEFAULT_MODEL_NAME
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기본 모델 이름 설정
default_model_name = DEFAULT_MODEL_NAME
recommender = PrecomputedRecommender(model_name=default_model_name)


@app.get("/recommend/{isbn13}")
def get_book_recommendations(
    isbn13: str,
    model_name: str = DEFAULT_MODEL_NAME,  # 동기화된 기본 모델명 사용
    db: Session = Depends(get_db),
):
    """
    특정 ISBN13에 대해 추천 책 반환.
    - `model_name` 파라미터를 통해 사용할 모델 이름을 변경 가능.
    """
    # 모델 폴더에 따라 Recommender 초기화
    recommender.update_model(model_name)

    # 해당 ISBN13의 책 데이터가 존재하는지 확인
    book = db.query(Book).filter(Book.isbn13 == isbn13).first()
    if not book:
        return {"message": f"해당 책 {isbn13}에 대한 데이터가 부족합니다."}

    # 추천 수행
    recommendations = recommender.recommend([isbn13], top_n=5)
    if not recommendations:
        return {"message": "해당 책에 대한 추천이 불가능 합니다."}

    return {"recommendations": recommendations}


@app.get("/recommend_user/{user_id}")
def get_recommendations(
    user_id: int,
    model_name: str = DEFAULT_MODEL_NAME,  # 동기화된 기본 모델명 사용
    db: Session = Depends(get_db),
):
    """
    특정 사용자 ID에 대해 추천 책 반환.
    - `model_name` 파라미터를 통해 사용할 모델 이름을 변경 가능.
    """
    # 모델 폴더에 따라 Recommender 초기화
    recommender.update_model(model_name)

    # 사용자가 읽은 책 가져오기
    user_books = db.query(BookRegister).filter(BookRegister.userId == user_id).all()
    user_isbns = [book.isbn13 for book in user_books]

    # 추천 수행
    recommendations = recommender.recommend(user_isbns)
    if not recommendations:
        return {"message": "해당 유저에 대한 추천이 불가능합니다."}

    return recommendations


@app.get("/keyword/{isbn13}")
def get_keywords(
    isbn13: str,
    db: Session = Depends(get_db),
):
    """
    특정 ISBN13에 대해 상위 15개 키워드, 키워드가 포함된 리뷰 개수, 키워드가 포함된 리뷰 목록 반환.
    """
    # 키워드 데이터 가져오기 (상위 15개만)
    keywords = db.execute(
        select(Keywords.keyword)
        .where(Keywords.isbn13 == isbn13)
        .order_by(Keywords.frequency.desc())
        .limit(15)
    ).fetchall()

    if not keywords:
        raise HTTPException(
            status_code=404, detail=f"해당 도서의 리뷰가 부족합니다 {isbn13}."
        )

    # 키워드-리뷰 매핑 가져오기
    keyword_reviews = {}
    keyword_counts = []
    for (keyword,) in keywords:
        reviews = db.execute(
            select(KeywordReviews.review_id)
            .where(KeywordReviews.isbn13 == isbn13)
            .where(KeywordReviews.keyword == keyword)
        ).fetchall()

        review_contents = db.execute(
            select(Reviews.review_content).where(
                Reviews.id.in_([r[0] for r in reviews])
            )
        ).fetchall()

        keyword_reviews[keyword] = [r[0] for r in review_contents]
        keyword_counts.append({"keyword": keyword, "count": len(reviews)})

    return {
        "isbn13": isbn13,
        "keywords": keyword_counts,
        "keyword_reviews": keyword_reviews,
    }
