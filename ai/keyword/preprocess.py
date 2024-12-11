import pandas as pd

# CSV 파일 읽기
data = pd.read_csv("merged_data_with_categories.csv")

# 중복된 행 제거
# 모든 열을 기준으로 중복 제거 (keep='first'는 첫 번째 중복된 행을 유지)
data_cleaned = data.drop_duplicates(keep="first")

# 결과 확인
print(f"Original number of rows: {len(data)}")
print(f"Number of rows after removing duplicates: {len(data_cleaned)}")

# 중복 제거된 데이터를 새로운 CSV 파일로 저장
data_cleaned.to_csv("merged_data_without_duplicates.csv", index=False)
