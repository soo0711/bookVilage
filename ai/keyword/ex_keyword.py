import pandas as pd
from konlpy.tag import Okt
import re
from collections import Counter

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


# `~기 좋은` 패턴 추출 함수
def extract_good_for_pattern(text):
    tokens = okt.pos(text)  # 형태소 및 품사 태깅
    filtered_tokens = [
        (word, tag) for word, tag in tokens if word not in stopwords
    ]  # 불용어 제거

    # 패턴: 동사(~기) + 형용사(좋은)
    patterns = []
    for i in range(len(filtered_tokens) - 2):
        if (
            filtered_tokens[i][1] == "Verb"
            and filtered_tokens[i + 1][0] == "기"
            and filtered_tokens[i + 2][0] == "좋은"
        ):
            patterns.append(f"{filtered_tokens[i][0]}기 좋은")
    return patterns


# 데이터 전처리 및 패턴 추출
data["cleaned_review"] = data["review_content"].apply(preprocess_review)
data["good_for_patterns"] = data["cleaned_review"].apply(extract_good_for_pattern)

# 모든 리뷰에서 추출된 패턴 리스트 생성
all_patterns = [pattern for sublist in data["good_for_patterns"] for pattern in sublist]

# 패턴 빈도 계산
pattern_counts = Counter(all_patterns)

# 상위 패턴 출력
print("Most Common Patterns (~하기 좋은):")
for pattern, count in pattern_counts.most_common(20):  # 상위 20개
    print(f"Pattern: {pattern}, Count: {count}")
