import requests
import pandas as pd
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import BookRegister
from database import Base
from datetime import datetime
import time

# 데이터베이스 설정
DATABASE_URL = "mysql+pymysql://root:0110@localhost:3306/bookvillage"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 테이블 생성 (필요 시)
Base.metadata.create_all(bind=engine)

# CSV 파일 경로
file_path = "merged_books_data.csv"

# FastAPI 서버 주소
FASTAPI_SERVER_URL = "http://127.0.0.1:8000/recommend"


# 사용자 데이터 생성
def insert_random_books_for_users(
    file_path: str, user_ids: list, sample_size: int = 10
):
    """
    각 사용자 ID에 대해 랜덤한 책 데이터를 book_register 테이블에 삽입합니다.
    """
    random.seed(int(time.time()))  # 랜덤 시드 초기화

    # 데이터베이스 세션 생성
    db = SessionLocal()
    try:
        # CSV 파일 읽기
        books_data = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")

        # 결측값 제거
        books_data = books_data.dropna(subset=["ISBN13"])

        # 각 사용자에 대해 데이터 삽입
        for user_id in user_ids:
            # 샘플 데이터 선택 (카테고리와 무관하게 랜덤으로 선택)
            random_data = books_data.sample(n=min(sample_size, len(books_data)))

            # 데이터 삽입
            for _, row in random_data.iterrows():
                book_register = BookRegister(
                    userId=user_id,
                    title=row["상품명"],
                    isbn13=row["ISBN13"],  # NaN 값은 이미 제거됨
                    review="랜덤 추천 도서입니다.",
                    point="4",  # 기본 평점 설정
                    b_condition="B",  # 기본 상태 설정
                    description=f"{row['저자']} 저, {row['출판사']} 출판",
                    exchange_YN="Y",  # 교환 가능
                    place="부산",  # 예시 위치
                    createdAt=datetime.now(),
                    updatedAt=datetime.now(),
                )
                db.add(book_register)

            db.commit()
            print(f"사용자 {user_id} - {len(random_data)}개의 데이터 삽입 성공")
    except Exception as e:
        db.rollback()
        print("데이터 삽입 중 오류 발생:", e)
    finally:
        db.close()


# FastAPI 요청 및 결과 저장
def fetch_recommendations_and_save(user_ids: list, output_file: str):
    """
    FastAPI 서버로 사용자별 추천 요청을 보내고 결과를 파일로 저장합니다.
    """
    results = []

    db = SessionLocal()
    try:
        for user_id in user_ids:
            # 추천 책 가져오기
            try:
                response = requests.get(f"{FASTAPI_SERVER_URL}/{user_id}")
                recommended_books = []
                if response.status_code == 200:
                    data = response.json()
                    if "message" in data:
                        # 추천이 없는 경우
                        print(f"사용자 {user_id}: {data['message']}")
                    else:
                        recommended_books = [
                            {
                                "isbn": rec["isbn13"],
                                "title": rec["title"],
                                "author": rec.get("author", ""),
                                "publisher": rec.get("publisher", ""),
                                "category": rec.get("category", ""),
                                "publication": rec.get("publication", ""),
                            }
                            for rec in data
                        ]
                else:
                    print(f"사용자 {user_id}: 서버 응답 오류 - {response.status_code}")
            except Exception as e:
                print(f"사용자 {user_id}: 요청 실패 - {str(e)}")
                recommended_books = []

            # 읽은 책 가져오기
            user_books = (
                db.query(BookRegister).filter(BookRegister.userId == user_id).all()
            )
            read_books = [
                {
                    "isbn": book.isbn13,
                    "title": book.title,
                    "author": "",  # 읽은 책의 저자 정보 추가
                    "publisher": "",  # 읽은 책의 출판사 정보 추가
                    "category": "",
                    "publication": "",
                }
                for book in user_books
            ]

            # 추천 책과 읽은 책을 한 줄로 병합
            max_len = max(len(recommended_books), len(read_books))
            for i in range(max_len):
                rec_book = recommended_books[i] if i < len(recommended_books) else {}
                read_book = read_books[i] if i < len(read_books) else {}

                results.append(
                    {
                        "user_id": user_id,
                        "rec_isbn": rec_book.get("isbn", ""),
                        "rec_title": rec_book.get("title", ""),
                        "rec_author": rec_book.get("author", ""),
                        "rec_publisher": rec_book.get("publisher", ""),
                        "rec_category": rec_book.get("category", ""),
                        "rec_publication": rec_book.get("publication", ""),
                        "read_isbn": read_book.get("isbn", ""),
                        "read_title": read_book.get("title", ""),
                        "read_author": read_book.get("author", ""),
                        "read_publisher": read_book.get("publisher", ""),
                        "read_category": read_book.get("category", ""),
                        "read_publication": read_book.get("publication", ""),
                    }
                )
    except Exception as e:
        print("추천 생성 중 오류 발생:", e)
    finally:
        db.close()

    # 결과를 CSV 파일로 저장
    df = pd.DataFrame(results)
    df.to_csv(output_file, index=False, encoding="utf-8-sig")
    print(f"추천 및 읽은 책 결과 저장 완료: {output_file}")


# 실행
if __name__ == "__main__":
    user_ids = list(range(132, 142))  # 테스트할 사용자 ID
    sample_size = 10  # 각 사용자가 읽은 책 개수
    output_file = "recommendation_results.csv"  # 결과 저장 파일

    # 책 데이터 삽입
    insert_random_books_for_users(file_path, user_ids, sample_size)

    # FastAPI 요청 및 추천 결과 저장
    fetch_recommendations_and_save(user_ids, output_file)
