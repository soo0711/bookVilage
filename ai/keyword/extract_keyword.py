import pandas as pd
from konlpy.tag import Okt
from collections import Counter
import re

# 데이터 로드
data = pd.read_csv("merged_data_with_categories.csv")

# Okt 형태소 분석기 초기화
okt = Okt()

# 리뷰 데이터 전처리: "리뷰 없음" 제거
data = data[data["review_content"] != "리뷰 없음"]

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
    "당",
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
    "아무",
    "나",
    "너희",
    "제",
    "책",
    "리뷰",
]


# 리뷰 데이터 전처리 함수
def preprocess_review(review):
    review = re.sub(r"[^가-힣\s]", "", str(review))  # 한글과 공백만 남기기
    return review


# 명사-형용사 조합 추출 함수
def extract_noun_adj_pairs(text):
    tokens = okt.pos(text)  # 형태소 및 품사 태깅
    filtered_tokens = [
        (word, tag) for word, tag in tokens if word not in stopwords
    ]  # 불용어 제거
    pairs = []
    for i in range(len(filtered_tokens) - 1):
        if filtered_tokens[i][1] == "Noun" and filtered_tokens[i + 1][1] == "Adjective":
            pairs.append((filtered_tokens[i][0], filtered_tokens[i + 1][0]))
    return pairs


# 데이터 전처리
data["cleaned_review"] = data["review_content"].apply(preprocess_review)

# 카테고리별 명사-형용사 조합 분석
categories = data["category"].unique()
category_results = {}

for category in categories:
    print(f"\nProcessing category: {category}")

    # 카테고리별 데이터 필터링
    category_data = data[data["category"] == category]

    # 명사-형용사 조합 추출
    category_data["noun_adj_pairs"] = category_data["cleaned_review"].apply(
        extract_noun_adj_pairs
    )

    # 모든 리뷰에서 추출된 명사-형용사 조합 리스트 생성
    all_pairs = [
        pair for sublist in category_data["noun_adj_pairs"] for pair in sublist
    ]

    # 명사-형용사 조합 빈도 계산
    pair_counts = Counter(all_pairs)
    common_pairs = pair_counts.most_common(20)  # 상위 20개

    # 결과 저장
    category_results[category] = common_pairs

    # 출력
    print(f"Top 20 Noun-Adjective Pairs for '{category}':")
    for pair, count in common_pairs:
        print(f"  Pair: {pair}, Count: {count}")

# 최종 결과 확인
for category, pairs in category_results.items():
    print(f"\nCategory: {category}")
    for pair, count in pairs:
        print(f"  Pair: {pair}, Count: {count}")
