from sqlalchemy import create_engine, text
import pandas as pd

# 데이터베이스 연결
engine = create_engine("mysql+pymysql://root:0110@localhost:3306/bookvillage1")

# CSV 파일 읽기
df1 = pd.read_csv("merged_book_details.csv")
df2 = pd.read_csv("merged_books_data.csv")

# ISBN13 열의 공백을 제거하고, 타입을 문자열로 변환
df1["ISBN13"] = df1["ISBN13"].astype(str).str.strip()
df2["ISBN13"] = df2["ISBN13"].astype(str).str.split(".").str[0]

# 각 데이터프레임에서 ISBN13 값의 중복 확인
df1_duplicates = df1[df1.duplicated(subset=["ISBN13"], keep=False)]
df2_duplicates = df2[df2.duplicated(subset=["ISBN13"], keep=False)]

# 중복된 ISBN13 값 출력
print("df1에서 중복된 ISBN13 값:")
print(df1_duplicates[["ISBN13"]].drop_duplicates())

print("\ndf2에서 중복된 ISBN13 값:")
print(df2_duplicates[["ISBN13"]].drop_duplicates())

# 중복 제거: 중복된 행을 삭제하고 첫 번째 항목만 남기기
df1 = df1.drop_duplicates(subset=["ISBN13"])
df2 = df2.drop_duplicates(subset=["ISBN13"])

# df1, df2의 ISBN13 값이 일치하는지 확인
common_isbn = df1["ISBN13"].isin(df2["ISBN13"]).sum()
print(f"공통 ISBN13 값의 수: {common_isbn}")

# 데이터 병합
df2 = df2[["ISBN13", "저자", "출판사", "출간일", "구분"]]
merged_df = pd.merge(df1, df2, on="ISBN13", how="inner")
merged_df = merged_df[
    [
        "ISBN13",
        "상품명",
        "cover_image",
        "description",
        "저자",
        "출판사",
        "출간일",
        "구분",
    ]
]
merged_df.columns = [
    "isbn13",
    "title",
    "cover",
    "description",
    "author",
    "publisher",
    "pubdate",
    "category",
]

# 'author' 열에 빈 문자열이나 공백만 있는 값이 있는지 확인
merged_df["author"] = merged_df["author"].replace(["", " ", None], "Unknown")

# 'author'가 NULL인 행을 처리 (예: 'Unknown'으로 채우기)
null_authors = merged_df[merged_df["author"] == "Unknown"]

# NULL인 'author' 값이 있는 행 출력
if not null_authors.empty:
    print("빈 문자열이나 공백으로 처리된 'author' 값이 있는 행:")
    print(null_authors)

# 중복된 ISBN13 값이 있는지 확인하고, 이미 존재하는 레코드를 건너뛰도록 처리
with engine.connect() as conn:
    # 기존 ISBN13 값 확인
    existing_isbns = pd.read_sql("SELECT isbn13 FROM book", conn)["isbn13"].tolist()

    # 이미 존재하는 ISBN13 값을 가진 행을 제외
    merged_df = merged_df[~merged_df["isbn13"].isin(existing_isbns)]

# 데이터베이스에 삽입
if len(merged_df) > 0:
    merged_df.to_sql(
        name="book", con=engine, if_exists="append", index=False, chunksize=100
    )
    print("데이터베이스에 성공적으로 삽입되었습니다.")
else:
    print("병합된 데이터가 없습니다.")

# 결과 확인
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM book"))
    count = result.scalar()
    print(f"데이터베이스의 총 레코드 수: {count}")
