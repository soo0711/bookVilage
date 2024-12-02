import pandas as pd
import numpy as np


def split_csv_file(input_file, output_directory, num_splits=5):
    """
    CSV 파일을 여러 개로 나누어 저장합니다.

    Args:
        input_file (str): 입력 CSV 파일 경로
        output_directory (str): 분할된 파일을 저장할 디렉터리 경로
        num_splits (int): 분할할 파일 개수

    Returns:
        List[str]: 분할된 파일 경로 리스트
    """
    # 데이터 읽기
    df = pd.read_csv(input_file, encoding="utf-8-sig")

    # 데이터 분할
    split_dfs = np.array_split(df, num_splits)

    # 파일 저장 경로 리스트
    output_files = []

    # 분할된 데이터 저장
    for i, split_df in enumerate(split_dfs, start=1):
        output_file = f"{output_directory}/split_part_{i}.csv"
        split_df.to_csv(output_file, index=False, encoding="utf-8-sig")
        output_files.append(output_file)

    return output_files


# 사용 예시
input_file_path = "merged_books_data.csv"  # 병합된 CSV 파일 경로
output_directory = "split_files"  # 분할된 파일을 저장할 디렉터리

# 디렉터리 생성
import os

os.makedirs(output_directory, exist_ok=True)

# 파일 분할 수행
output_files = split_csv_file(input_file_path, output_directory, num_splits=5)

# 결과 출력
print("분할된 파일 경로:")
print(output_files)
