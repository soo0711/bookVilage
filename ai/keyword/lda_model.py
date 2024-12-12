import pandas as pd
from konlpy.tag import Okt
from gensim import corpora, models
import re

# 데이터 로드
data = pd.read_csv("merged_data_with_categories.csv")

# 리뷰 데이터 전처리: "리뷰 없음" 제거
data = data[data["review_content"] != "리뷰 없음"]

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
    "부터",
    "저",
    "우리",
    "너",
    "저희",
    "그",
    "수",
    "책",
    "내용",
    "사람",
    "생각",
    "마음",
    "추천",
    "작품",
    "소설",
    "정도",
    "번역",
    "대한",
    "느낌",
    "이해",
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
data["cleaned_review"] = data["review_content"].apply(preprocess_review)

# 명사 추출
texts = data["cleaned_review"].apply(extract_nouns).tolist()

# 텍스트가 없는 경우 처리
texts = [text for text in texts if text]

# 단어-문서 행렬 생성
dictionary = corpora.Dictionary(texts)
corpus = [dictionary.doc2bow(text) for text in texts]

# LDA 모델 생성
lda_model = models.LdaModel(
    corpus,
    id2word=dictionary,
    num_topics=5,  # 추출할 토픽 수
    random_state=42,
    passes=10,  # 학습 반복 횟수
    iterations=50,
)

# 토픽 출력
topics = lda_model.print_topics(num_words=10)
print("Extracted Topics:")
for idx, topic in topics:
    print(f"Topic {idx + 1}: {topic}")

# 결과 저장 (옵션)
output_file = "lda_topics.csv"
pd.DataFrame(topics, columns=["Topic Number", "Keywords"]).to_csv(
    output_file, index=False
)
print(f"Topics saved to {output_file}")
