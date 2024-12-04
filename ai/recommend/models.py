from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from database import Base


class Book(Base):
    """
    책 정보를 저장하는 테이블 모델.
    """

    __tablename__ = "book"

    isbn13 = Column(String(255), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    cover = Column(String(512))
    description = Column(Text)
    author = Column(String(255), nullable=False)
    publisher = Column(String(255))
    pubdate = Column(Date)
    category = Column(String(255))


class BookRegister(Base):
    """
    유저가 읽은 책 정보를 저장하는 테이블 모델.
    """

    __tablename__ = "book_register"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userId = Column(Integer, nullable=False)
    title = Column(String(512), nullable=False)
    isbn13 = Column(String(13), ForeignKey("book.isbn13"), nullable=False)
    review = Column(Text, nullable=False)
    point = Column(String(1), nullable=False)
    b_condition = Column(String(1))
    description = Column(Text)
    exchange_YN = Column(String(1), nullable=False)
    place = Column(Text)
    createdAt = Column(Date)
    updatedAt = Column(Date)
