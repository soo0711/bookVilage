import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from app import app
from models import Book, BookRegister

DATABASE_URL = "mysql+pymysql://root:0110@localhost:3306/bookvillage"
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def test_db():
    db = TestingSessionLocal()
    try:
        # 기존 데이터 삭제
        db.execute(text("DELETE FROM book_register WHERE userId = 123"))
        db.execute(text("DELETE FROM book WHERE isbn13 LIKE '978%'"))

        # 테스트 데이터 삽입
        db.execute(
            text(
                """
            INSERT INTO book (isbn13, title, description, cover, author, publisher, category, pubdate)
            VALUES 
            ('9780132350884', 'Clean Code', 'A handbook of Agile software craftsmanship.',
            'https://example.com/covers/9780132350884.jpg', 'Robert C. Martin', 'Prentice Hall', 'Programming', '2008-08-01'),
            ('9780321356680', 'Effective Java', 'Best practices for Java programming.',
            'https://example.com/covers/9780321356680.jpg', 'Joshua Bloch', 'Addison-Wesley', 'Programming', '2008-05-08');
            """
            )
        )
        db.execute(
            text(
                """
            INSERT INTO book_register (userId, title, isbn13, review, point, b_condition, description, exchange_YN, place, createdAt, updatedAt)
            VALUES
            (123, 'Clean Code', '9780132350884', 'Excellent book on clean coding practices.', '5', 'A', 'Almost new', 'Y', 'Library', '2023-11-30', '2023-11-30'),
            (123, 'Effective Java', '9780321356680', 'Great for Java developers.', '4', 'B', 'Some wear', 'N', 'Office', '2023-11-30', '2023-11-30');
            """
            )
        )
        db.commit()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client


def test_recommend_books(client):
    """
    /recommend/{user_id} 엔드포인트 테스트.
    """
    response = client.get("/recommend/123")
    assert response.status_code == 200  # 상태 코드 확인
    data = response.json()
    print("\nJSON Response:", data)  # JSON 응답 출력

    assert "user_id" in data
    assert data["user_id"] == 123
    assert "recommended_books" in data
    assert len(data["recommended_books"]) == 2
    assert data["recommended_books"][0]["isbn"] == "9780132350884"
    assert data["recommended_books"][1]["isbn"] == "9780321356680"
