from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from recommend import recommend_books
from database import get_db
from schemas import RecommendationResponse

app = FastAPI()


@app.get("/recommend/{user_id}", response_model=RecommendationResponse)
def recommend(user_id: int, db: Session = Depends(get_db)):
    """
    유저 ID를 입력받아 추천 책 리스트를 반환.
    """
    return recommend_books(user_id, db)
