from sqlalchemy.orm import Session
from models import BookRegister, Book
from typing import List


def get_book_details(isbn_list: List[str], db: Session):
    """
    ISBN 리스트를 기반으로 book 테이블에서 세부 정보를 가져옵니다.
    """
    books = db.query(Book).filter(Book.isbn13.in_(isbn_list)).all()
    return [
        {
            "id": index + 1,
            "isbn": book.isbn13,
            "title": book.title,
            "description": book.description,
            "cover": book.cover,
            "author": book.author,
            "publisher": book.publisher,
            "category": book.category,
            "publication": book.pubdate.isoformat() if book.pubdate else None,
            "createdAt": "2023-11-30T12:00:00Z",  # 예시 createdAt 값
        }
        for index, book in enumerate(books)
    ]


def recommend_books(user_id: int, db: Session):
    """
    유저가 읽은 책 데이터를 기반으로 추천 책 리스트를 반환.
    """
    # 유저가 읽은 책의 ISBN13 조회
    user_books = (
        db.query(BookRegister.isbn13).filter(BookRegister.userId == user_id).all()
    )
    user_books = [isbn[0] for isbn in user_books]

    if not user_books:
        return {"user_id": user_id, "recommended_books": []}

    # 간단히 유저가 읽은 책 기반으로 추천 (테스트용으로 동일 ISBN 반환)
    recommended_isbns = user_books[:2]  # 샘플: 유저가 읽은 책 중 상위 2개 반환

    # 책 세부 정보 가져오기
    recommended_books = get_book_details(recommended_isbns, db)

    return {"user_id": user_id, "recommended_books": recommended_books}
