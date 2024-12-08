from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import BookRegister
from recommend import PrecomputedRecommender
from config import DEFAULT_MODEL_NAME  # 설정 파일에서 모델명 가져오기

app = FastAPI()

# 기본 모델 이름 설정
default_model_name = DEFAULT_MODEL_NAME
recommender = PrecomputedRecommender(model_name=default_model_name)


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
