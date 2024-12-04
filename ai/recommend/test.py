import pandas as pd

# 새로 업로드된 CSV 파일 읽기
file_path = "./book_db.csv"

try:
    book_data = pd.read_csv(file_path, encoding="cp949")
    book_data.head()  # 파일 내용 확인
except Exception as e:
    str(e)
