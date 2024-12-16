from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

import os
import time

# 데이터베이스 URL 설정
SQLALCHEMY_DATABASE_URL = os.getenv(
    "SQLALCHEMY_DATABASE_URL", "mysql+pymysql://root:0110@localhost:3306/bookvillage1"
)


# 데이터베이스 엔진 생성
def create_db_engine():
    # 데이터 베이스 연결 실패 시 5초마다 재시도
    while True:
        try:
            engine = create_engine(SQLALCHEMY_DATABASE_URL)
            # 연결 확인을 위한 테스트 쿼리 실행
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))  # 수정된 부분
            print("데이터 베이스 연결 성공")
            return engine
        except OperationalError:
            print("데이터 베이스 연결 실패, 5초 뒤 재시도됩니다..")
            time.sleep(5)


# SQLAlchemy 엔진 생성
engine = create_db_engine()

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 정의
Base = declarative_base()


# 데이터베이스 세션 생성 및 종료
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
