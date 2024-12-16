import pandas as pd
from konlpy.tag import Okt
from collections import Counter
import re

# 데이터 로드
file_path = "merged_data_without_duplicates.csv"
data = pd.read_csv(file_path)

# Okt 형태소 분석기 초기화
okt = Okt()

# 리뷰 데이터 전처리: "리뷰 없음" 제거
data = data[data["review_content"] != "리뷰 없음"]


# 리뷰 데이터 전처리 함수
def preprocess_review(review):
    # 한글과 공백만 남기기
    return re.sub(r"[^가-힣\s]", "", str(review))


# 특정 패턴 추출 함수 (예: ~기 좋은)
def extract_meaningful_phrases(text):
    tokens = okt.pos(text)
    phrases = []
    for i in range(len(tokens) - 2):
        # 형식: 동사 + '기' + 형용사 (ex: 읽기 좋은)
        if (
            tokens[i][1] == "Verb"
            and tokens[i + 1][0] == "기"
            and tokens[i + 2][1] == "Adjective"
        ):
            phrases.append(f"{tokens[i][0]}기 {tokens[i + 2][0]}")
        # 형식: 명사 + '에' + 형용사 (ex: 자기 전에 좋은)
        if (
            tokens[i][1] == "Noun"
            and tokens[i + 1][0] == "에"
            and tokens[i + 2][1] == "Adjective"
        ):
            phrases.append(f"{tokens[i][0]}에 {tokens[i + 2][0]}")
    return phrases


# 데이터 전처리 및 키워드 추출
data["cleaned_review"] = data["review_content"].apply(preprocess_review)
data["keywords"] = data["cleaned_review"].apply(extract_meaningful_phrases)

# 모든 리뷰에서 추출된 키워드 리스트 생성
all_phrases = [phrase for sublist in data["keywords"] for phrase in sublist]

# 키워드 빈도 계산
phrase_counts = Counter(all_phrases)

# 자주 사용된 키워드 추출 (상위 20개)
common_phrases = phrase_counts.most_common(20)

# 결과 출력
print("Top 20 Most Common Meaningful Phrases:")
for phrase, count in common_phrases:
    print(f"Phrase: {phrase}, Count: {count}")

# CSV 파일로 저장 (옵션)
output_file = "meaningful_phrases.csv"
pd.DataFrame(common_phrases, columns=["Phrase", "Count"]).to_csv(
    output_file, index=False
)
print(f"Results saved to {output_file}")
