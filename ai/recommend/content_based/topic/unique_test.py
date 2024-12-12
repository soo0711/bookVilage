from sqlalchemy.orm import Session
from sqlalchemy import select
from konlpy.tag import Okt
from gensim import corpora, models
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import re
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from database import engine
from models import Reviews, Book


# 데이터베이스 세션 생성
def fetch_reviews_from_db(isbn_target):
    with Session(engine) as session:
        # reviews 테이블에서 특정 ISBN13에 해당하는 리뷰 데이터 가져오기
        query = select(Reviews).where(Reviews.isbn13 == str(isbn_target))
        reviews = session.execute(query).scalars().all()
    return reviews


def fetch_author_name(isbn_target):
    with Session(engine) as session:
        # book 테이블에서 특정 ISBN13에 해당하는 작가 이름 가져오기
        query = select(Book.author).where(Book.isbn13 == str(isbn_target))
        author = session.execute(query).scalar()
    return author


# 작가 이름에서 불필요한 단어 제거 함수
def clean_author_name(author_name):
    if author_name:
        return re.sub(
            r"\s*지음$", "", author_name
        ).strip()  # '지음'으로 끝나는 단어 제거
    return author_name


# 불용어 리스트 로드
def load_stopwords(filepath="stopwords.txt"):
    with open(filepath, "r", encoding="utf-8") as file:
        stopwords = [line.strip() for line in file if line.strip()]
    return stopwords


# 리뷰 데이터 전처리 함수
def preprocess_review(review):
    review = re.sub(r"[^가-힣\s]", "", str(review))  # 한글과 공백만 남기기
    return review


# 명사 추출 함수
def extract_nouns(text, stopwords, okt):
    nouns = okt.nouns(text)  # 명사 추출
    return [word for word in nouns if word not in stopwords]  # 불용어 제거


# ISBN13 값 설정
isbn_target = "9788936434120"

# DB에서 리뷰 데이터와 작가 이름 가져오기
reviews = fetch_reviews_from_db(isbn_target)
author_name = fetch_author_name(isbn_target)
author_name_cleaned = clean_author_name(author_name)  # 작가 이름 정리

# 불용어 리스트 로드 및 작가 이름 추가
stopwords = load_stopwords()
if author_name_cleaned:
    stopwords.append(author_name_cleaned)  # 정리된 작가 이름을 불용어에 추가

# Okt 형태소 분석기 초기화
okt = Okt()

# 리뷰 데이터를 텍스트로 변환
review_texts = [review.review_content for review in reviews]

# 리뷰 데이터 전처리 및 명사 추출
cleaned_reviews = [preprocess_review(review) for review in review_texts]
texts = [extract_nouns(review, stopwords, okt) for review in cleaned_reviews]

# LDA 토픽 모델링
dictionary = corpora.Dictionary(texts)
corpus = [dictionary.doc2bow(text) for text in texts]
lda_model = models.LdaModel(
    corpus,
    id2word=dictionary,
    num_topics=10,  # 추출할 토픽 수
    random_state=42,
    passes=10,
    iterations=50,
)

# 토픽 추출
topics = lda_model.show_topics(num_topics=10, num_words=10, formatted=False)

# 단어와 가중치 데이터 추출
word_weights = {}
for topic in topics:
    for word, weight in topic[1]:  # topic[1]은 단어와 가중치의 튜플 리스트
        if word in word_weights:
            word_weights[word] += weight
        else:
            word_weights[word] = weight

# 상위 15개의 단어만 추출
top_words = dict(sorted(word_weights.items(), key=lambda x: x[1], reverse=True)[:15])

# WordCloud 시각화
wordcloud = WordCloud(
    font_path="C:/Windows/Fonts/malgun.ttf",  # Windows 환경용 폰트 경로
    width=800,
    height=400,
    background_color="white",
).generate_from_frequencies(top_words)

# WordCloud 출력
plt.figure(figsize=(10, 6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.show()
