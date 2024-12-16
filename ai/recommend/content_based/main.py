from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from recommend import PrecomputedRecommender
from models import Book
from config import DEFAULT_MODEL_NAME

app = FastAPI()

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
        return {"message": f"Book with ISBN13 {isbn13} not found."}

    # 추천 수행
    recommendations = recommender.recommend([isbn13], top_n=5)
    if not recommendations:
        return {"message": "No recommendations available for the given book."}

    return {"recommendations": recommendations}


@app.get("/recommend/{user_id}")
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
        return {"message": "No recommendations available for the user."}

    return recommendations
