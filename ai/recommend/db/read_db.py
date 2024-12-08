import pandas as pd

# Load the uploaded book database CSV to analyze its structure
file_path = "book_db.csv"
book_data = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")


# Display the first few rows to understand the structure and content
book_data.head()
# 데이터의 요약 정보 확인
print(book_data.info())

# 특정 열의 결측값 확인
print(book_data.isnull().sum())
