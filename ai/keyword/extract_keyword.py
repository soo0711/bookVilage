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
    "있",
    "배송",
    "소설",
    "좋다",
    "작품",
    "뿐",
    "거",
    "중",
    "입니다",
    "추합니다",
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


# 데이터 전처리 및 명사-형용사 조합 추출
data["cleaned_review"] = data["review_content"].apply(preprocess_review)
data["noun_adj_pairs"] = data["cleaned_review"].apply(extract_noun_adj_pairs)

# 모든 리뷰에서 추출된 명사-형용사 조합 리스트 생성
all_pairs = [pair for sublist in data["noun_adj_pairs"] for pair in sublist]

# 명사-형용사 조합 빈도 계산
pair_counts = Counter(all_pairs)

# 자주 사용된 조합 추출 (상위 20개)
common_pairs = pair_counts.most_common(20)

# 조합별 리뷰와 리뷰 개수 추출
pair_reviews = []
for pair, _ in common_pairs:
    pair_pattern = f"{pair[0]}.*{pair[1]}"  # 명사와 형용사가 연속적으로 등장하는 패턴
    matching_reviews = data[data["cleaned_review"].str.contains(pair_pattern, na=False)]
    pair_reviews.append((pair, len(matching_reviews), matching_reviews))

# 리뷰 개수로 내림차순 정렬
sorted_pair_reviews = sorted(pair_reviews, key=lambda x: x[1], reverse=True)

# 출력
print("Top Noun-Adjective Pairs Sorted by Review Count:")
for pair, review_count, reviews in sorted_pair_reviews:
    print(f"Pair: {pair}, Review Count: {review_count}")
    print("Sample Reviews:")
    print(reviews["review_content"].head(3).tolist())  # 상위 3개 리뷰 내용 출력
