import os
import pandas as pd

# 디렉터리 경로 설정
reviews_directory = "csv_reviews"
books_directory = "csv_books"
output_directory = "csv_join_reviews"

# 저장 디렉터리 생성
os.makedirs(output_directory, exist_ok=True)

# 파일 리스트 가져오기
review_files = [f for f in os.listdir(reviews_directory) if f.endswith(".csv")]
book_files = [f for f in os.listdir(books_directory) if f.endswith(".csv")]

# 파일 처리
for review_file, book_file in zip(review_files, book_files):
    try:
        # 파일 경로 설정
        file_with_reviews = os.path.join(reviews_directory, review_file)
        file_without_reviews = os.path.join(books_directory, book_file)

        # 파일 읽기
        df_reviews = pd.read_csv(
            file_with_reviews,
            sep=",",
            quotechar='"',
            on_bad_lines="skip",
            encoding="utf-8-sig",
        )
        df_no_reviews = pd.read_csv(
            file_without_reviews,
            sep=",",
            quotechar='"',
            on_bad_lines="skip",
            encoding="utf-8-sig",
        )

        # 컬럼명 정리
        df_reviews.rename(columns={"ISBN": "ISBN13"}, inplace=True)

        # Outer join 수행
        merged_df = pd.merge(df_no_reviews, df_reviews, how="outer", on="ISBN13")

        # 컬럼 확인
        if "구분" not in merged_df.columns:
            raise KeyError(f"'구분' 컬럼이 {book_file} 또는 {review_file}에 없습니다.")

        # 리뷰 없는 경우 "리뷰없음"으로 표시
        merged_df["review_content"] = merged_df["review_content"].fillna("리뷰없음")

        # Rating 없는 경우 0으로 표시
        merged_df["rating"] = merged_df["rating"].fillna(0)

        # 필요한 컬럼만 남기기
        filtered_df = merged_df[["구분", "ISBN13", "review_content", "rating"]]

        # 카테고리명 설정
        category_name = filtered_df["구분"].iloc[0]

        # 파일 시스템에 맞게 카테고리명 정리
        safe_category_name = category_name.replace("/", "_").replace("\\", "_")

        # 결과 파일 저장
        output_file_path = os.path.join(output_directory, f"{safe_category_name}.csv")
        filtered_df.to_csv(output_file_path, index=False, encoding="utf-8-sig")

        print(f"처리 완료: {output_file_path}")

    except Exception as e:
        print(f"파일 처리 중 오류 발생: {review_file} 및 {book_file}")
        print(f"오류 내용: {e}")
