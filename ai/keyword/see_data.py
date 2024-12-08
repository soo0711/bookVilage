import pandas as pd

# 데이터 로드
file_path = "merged_data_with_categories.csv"
df = pd.read_csv(file_path)

# 유효 리뷰 필터링
valid_reviews = df[df["review_content"] != "리뷰없음"]
