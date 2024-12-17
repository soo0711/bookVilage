import re
from konlpy.tag import Okt


# 불용어 리스트 로드
def load_stopwords(filepath="stopwords.txt"):
    with open(filepath, "r", encoding="utf-8") as file:
        stopwords = [line.strip() for line in file if line.strip()]
    return stopwords


# 리뷰 데이터 전처리
def preprocess_review(review):
    return re.sub(r"[^가-힣\s]", "", str(review))


# 명사 추출
def extract_nouns(text, stopwords):
    okt = Okt()
    nouns = okt.nouns(text)
    return [word for word in nouns if word not in stopwords]
