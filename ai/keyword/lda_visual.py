import pandas as pd
from konlpy.tag import Okt
from gensim import corpora, models
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import re

# 데이터 로드
file_path = "merged_data_without_duplicates.csv"
data = pd.read_csv(file_path)

# ISBN13 값 처리 (float64에서 숫자 형식으로 변환)
isbn_target = 9788936434120.0  # 원하는 ISBN 값 (float로 명시)

# ISBN13 기준으로 데이터 필터링
filtered_data = data[data["ISBN13"] == isbn_target]

# 리뷰 데이터 전처리: "리뷰 없음" 제거
filtered_data = filtered_data[filtered_data["review_content"] != "리뷰 없음"]

# Okt 형태소 분석기 초기화
okt = Okt()

# 불용어 리스트 정의
stopwords = [
    "의",
    "가",
    "이",
    "은",
    "들",
    "는",
    "좀",
    "잘",
    "걍",
    "과",
    "도",
    "를",
    "으로",
    "자",
    "에",
    "와",
    "한",
    "하다",
    "것",
    "라고",
    "에게",
    "라면",
    "을",
    "이라",
    "라니",
    "있다",
    "아",
    "랑",
    "쯤된",
    "에서",
    "에선",
    "어",
    "이지만",
    "으로나",
    "때",
    "때는",
    "때라면",
    "때라서",
    "라",
    "이다",
    "있",
    "죠",
    "고",
    "니",
    "로",
    "있",
    "같",
    "어서",
    "어요",
    "는데",
    "습니다",
    "면서",
    "많이",
    "마",
    "더",
    "그렇다",
    "안",
    "정말",
    "같다",
    "임",
    "만",
    "인",
    "그",
    "저",
    "수",
    "거",
    "책",
    "리뷰",
    "작가",
    "소설",
]


# 리뷰 데이터 전처리 함수
def preprocess_review(review):
    review = re.sub(r"[^가-힣\s]", "", str(review))  # 한글과 공백만 남기기
    return review


# 명사 추출 함수
def extract_nouns(text):
    nouns = okt.nouns(text)  # 명사 추출
    return [word for word in nouns if word not in stopwords]  # 불용어 제거


# 리뷰 데이터 전처리
filtered_data["cleaned_review"] = filtered_data["review_content"].apply(
    preprocess_review
)

# 명사 추출
texts = filtered_data["cleaned_review"].apply(extract_nouns).tolist()

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

# WordCloud 시각화
wordcloud = WordCloud(
    font_path="C:\Windows\Fonts\malgun.ttf",  # Windows 환경용 폰트 경로
    width=800,
    height=400,
    background_color="white",
).generate_from_frequencies(word_weights)

# WordCloud 출력
plt.figure(figsize=(10, 6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.show()
