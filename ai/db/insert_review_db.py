import pandas as pd
from sqlalchemy import create_engine

# 데이터 로드
file_path = "merged_data_without_duplicates.csv"
data = pd.read_csv(file_path)

# "리뷰 없음" 제거
data = data[data["review_content"] != "리뷰 없음"]
data = data[data["review_content"] != "리뷰없음"]


# ISBN13 변환: NaN 값 처리 및 문자열 변환
def convert_isbn(isbn):
    try:
        return str(int(isbn))  # 소수점 제거 후 문자열 변환
    except ValueError:
        return None  # 변환 불가한 경우 None 반환


data["ISBN13"] = data["ISBN13"].apply(convert_isbn)

# 유효한 ISBN13 데이터만 필터링
data = data[data["ISBN13"].notnull()]

# 데이터베이스 연결 설정
db_url = "mysql+pymysql://root:0110@localhost:3306/bookvillage1"
engine = create_engine(db_url)

# 데이터베이스에 저장
try:
    data[["ISBN13", "review_content"]].to_sql(
        name="reviews", con=engine, if_exists="append", index=False
    )
    print("데이터베이스에 성공적으로 저장되었습니다.")
except Exception as e:
    print(f"데이터베이스 저장 중 오류 발생: {e}")
