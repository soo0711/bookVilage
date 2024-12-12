from sqlalchemy.orm import sessionmaker
from datetime import datetime
from models import BookRegister
from database import engine

# 사용자 ID 및 읽은 책 목록
user_id = 996  # 예시 사용자 ID
isbn_list = [
    "9788954641630",
    "9788936438715",
    "9788954699372",
]

# 데이터베이스 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    for isbn in isbn_list:
        # 예시 데이터로 삽입 (각 ISBN의 상세 정보는 사전에 확보해야 합니다.)
        new_book = BookRegister(
            userId=user_id,
            title=f"Book Title for ISBN {isbn}",  # 책 제목
            isbn13=isbn,
            review="사용자가 읽은 책",
            point="5",  # 평점 (예: 5)
            b_condition="A",  # 책 상태 (예: A)
            description=f"Description for ISBN {isbn}",  # 책 설명
            exchange_YN="N",  # 교환 여부 (예: N)
            place="서울",  # 예시 장소
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
        )
        db.add(new_book)

    db.commit()
    print("사용자의 읽은 책 데이터를 성공적으로 삽입했습니다.")
except Exception as e:
    db.rollback()
    print("데이터 삽입 중 오류 발생:", e)
finally:
    db.close()
