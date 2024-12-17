from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 데이터베이스 URL 설정
SQLALCHEMY_DATABASE_URL = os.getenv(
    "SQLALCHEMY_DATABASE_URL",
    "mysql+pymysql://dbid233:dbpass233@localhost:3306/db24331",
)

# SQLAlchemy 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL)

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
