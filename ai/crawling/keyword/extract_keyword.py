import pandas as pd
from konlpy.tag import Okt
from collections import Counter
import re
import jpype

# JVM 경로 설정 (예시: Java 설치 경로)
jvm_path = r"C:\Program Files\Java\jdk-23\bin\server\jvm.dll"

# JVM 경로 수동 설정
if not jpype.isJVMStarted():
    jpype.startJVM(jvm_path)
# 데이터 로드
data = pd.read_csv("merged_data_with_categories.csv")

# Initialize the Korean text analyzer
okt = Okt()


# 리뷰 데이터 전처리 함수
def preprocess_review(review):
    review = re.sub(r"[^가-힣\s]", "", str(review))  # 한글과 공백만 남기기
    return review


# 리뷰 데이터 전처리
data["cleaned_review"] = data["review_content"].apply(preprocess_review)

# 형태소 분석 및 명사 추출
data["nouns"] = data["cleaned_review"].apply(okt.nouns)

# 모든 리뷰에서 추출된 명사 리스트 생성
all_nouns = [noun for sublist in data["nouns"] for noun in sublist]

# 단어 빈도 계산
noun_counts = Counter(all_nouns)

# 자주 사용된 키워드 추출 (상위 20개)
common_keywords = noun_counts.most_common(20)

# 키워드별 리뷰 분류
keyword_reviews = {}
for keyword, _ in common_keywords:
    keyword_reviews[keyword] = data[
        data["cleaned_review"].str.contains(keyword, na=False)
    ]

# 상위 키워드와 분류된 리뷰 데이터 확인
print("Top Keywords:", common_keywords)
for keyword, reviews in keyword_reviews.items():
    print(f"Keyword: {keyword}, Number of Reviews: {len(reviews)}")
