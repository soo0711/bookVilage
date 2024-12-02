import os
import pandas as pd

# 병합 대상 디렉터리 설정
input_directory = "csv_join_reviews"
output_file_path = "csv_join_reviews/merged_data.csv"

# 병합할 데이터프레임 리스트
data_frames = []

# 파일 리스트 가져오기
csv_files = [f for f in os.listdir(input_directory) if f.endswith(".csv")]

# 파일 병합
for csv_file in csv_files:
    try:
        file_path = os.path.join(input_directory, csv_file)
        df = pd.read_csv(file_path, encoding="utf-8-sig")
        data_frames.append(df)
    except Exception as e:
        print(f"파일 처리 중 오류 발생: {csv_file}")
        print(f"오류 내용: {e}")

# 데이터프레임 병합
merged_df = pd.concat(data_frames, ignore_index=True)

# '구분' 컬럼 고유값 확인 및 숫자 매핑
unique_categories = merged_df["구분"].unique()
category_mapping = {category: idx for idx, category in enumerate(unique_categories)}
merged_df["구분"] = merged_df["구분"].map(category_mapping)

# 병합된 데이터 저장
merged_df.to_csv(output_file_path, index=False, encoding="utf-8-sig")

# 딕셔너리 출력
print("구분 컬럼 매핑 딕셔너리:")
print(category_mapping)

print(f"병합된 데이터가 '{output_file_path}'에 저장되었습니다.")
