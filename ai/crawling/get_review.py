import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

<<<<<<< HEAD
# AJAX 요청 URL
=======
# HTTP AJAX 요청 URL
>>>>>>> taeyoon
URL = "https://www.aladin.co.kr/ucl/shop/product/ajax/GetCommunityListAjax.aspx"


# 리뷰를 수집하는 함수
def fetch_reviews(item_id):
<<<<<<< HEAD
=======
    """
    주어진 ItemId에 해당하는 리뷰를 가져오는 함수.

    Args:
        item_id (str): 리뷰를 가져올 책의 ItemId.

    Returns:
        list: 리뷰와 평점 데이터를 포함한 리스트.
    """
    # 요청 파라미터 설정
>>>>>>> taeyoon
    params = {
        "ProductItemId": item_id,
        "itemId": item_id,
        "pageCount": 25,  # 한 번에 가져올 리뷰 수
        "communitytype": "CommentReview",
        "nemoType": -1,
<<<<<<< HEAD
        "page": 1,
        "startNumber": 1,
        "endNumber": 10,
        "sort": 2,
=======
        "page": 1,  # 초기 페이지 번호
        "startNumber": 1,  # 시작 번호
        "endNumber": 10,  # 끝 번호
        "sort": 2,  # 정렬 방식
>>>>>>> taeyoon
        "IsOrderer": 1,
        "BranchType": 1,
        "IsAjax": "true",
        "pageType": 0,
    }
<<<<<<< HEAD
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    reviews = []

    while True:
        try:
            response = requests.get(URL, params=params, headers=headers, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching reviews for ItemId {item_id}: {e}")
            break

        soup = BeautifulSoup(response.text, "html.parser")
        review_items = soup.find_all("div", class_="hundred_list")

=======
    # HTTP 헤더 설정
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    reviews = []  # 리뷰 데이터를 저장할 리스트

    while True:
        try:
            # GET 요청으로 데이터 가져오기
            response = requests.get(URL, params=params, headers=headers, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            # 요청 실패 시 에러 출력 후 종료
            print(f"Error fetching reviews for ItemId {item_id}: {e}")
            break

        # HTML 파싱
        soup = BeautifulSoup(response.text, "html.parser")
        # 리뷰 항목 가져오기
        review_items = soup.find_all("div", class_="hundred_list")

        # 리뷰가 없으면 종료
>>>>>>> taeyoon
        if not review_items:
            print(f"ItemId {item_id}: 모든 리뷰를 가져왔습니다.")
            break

        for item in review_items:
            # 별점 추출
            star_section = item.find("div", class_="HL_star")
            if star_section:
<<<<<<< HEAD
=======
                # 활성화된 별 개수로 별점 계산
>>>>>>> taeyoon
                star_count = len(
                    star_section.find_all("img", src=lambda x: "icon_star_on" in x)
                )
            else:
                star_count = 0

            # 리뷰 내용 추출
            content_sections = item.find_all(
                "span", id=lambda x: x and x.startswith("spnPaper")
            )
            content_text = None
            for content in content_sections:
<<<<<<< HEAD
=======
                # 숨겨진 리뷰가 아닌지 확인
>>>>>>> taeyoon
                if (
                    "style" not in content.attrs
                    or "display:none" not in content.attrs["style"]
                ):
                    content_text = content.get_text(strip=True)
                    break

<<<<<<< HEAD
            # 리뷰 내용이 있는 경우만 추가
            if content_text and content_text != "리뷰 내용 없음":
                print(f"Rating: {star_count}, Review: {content_text}")  # 출력
                reviews.append(
                    {
                        "rating": star_count,
                        "review_content": content_text,
                    }
                )
=======
            # 리뷰 내용이 없을 경우 기본값 설정
            if not content_text:
                content_text = "리뷰 내용 없음"
                star_count = 0

            # 리뷰 내용이 있을 경우 출력 및 저장
            if content_text and content_text != "리뷰 내용 없음":
                print(f"Rating: {star_count}, Review: {content_text}")

            reviews.append(
                {
                    "rating": star_count,  # 별점
                    "review_content": content_text,  # 리뷰 내용
                }
            )
>>>>>>> taeyoon

        # 다음 페이지로 이동
        params["page"] += 1
        params["startNumber"] += params["pageCount"]
        params["endNumber"] += params["pageCount"]

    return reviews


# 입력 폴더의 파일을 읽고 리뷰를 수집 및 저장
def extract_reviews(input_folder, output_folder):
<<<<<<< HEAD
    input_files = [
        os.path.join(input_folder, f)
        for f in os.listdir(input_folder)
        if f.endswith(".csv")
    ]

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for input_path in input_files:
        print(f"Processing file: {input_path}")
        try:
            df = pd.read_csv(input_path, encoding="utf-8", on_bad_lines="skip")
        except Exception as e:
            print(f"Error reading file {input_path}: {e}")
            continue

=======
    """
    입력 폴더에서 ItemId를 읽고 리뷰를 수집해 출력 폴더에 저장하는 함수.

    Args:
        input_folder (str): 입력 파일이 있는 폴더 경로.
        output_folder (str): 리뷰 결과를 저장할 폴더 경로.
    """
    # 입력 폴더의 모든 CSV 파일 목록 가져오기
    input_files = [
        os.path.join(input_folder, f)
        for f in os.listdir(input_folder)
        if f.endswith(".csv")  # CSV 파일만 선택
    ]

    # 출력 폴더가 없으면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 각 파일 처리
    for input_path in input_files:
        print(f"Processing file: {input_path}")
        try:
            # CSV 파일 읽기
            df = pd.read_csv(input_path, encoding="utf-8", on_bad_lines="skip")
        except Exception as e:
            # 파일 읽기 실패 시 에러 출력
            print(f"Error reading file {input_path}: {e}")
            continue

        # 필요한 컬럼이 있는지 확인
>>>>>>> taeyoon
        if "ItemId" not in df.columns or "ISBN13" not in df.columns:
            print(
                f"File {input_path} does not contain required columns (ItemId, ISBN13)."
            )
            continue

<<<<<<< HEAD
        output_data = []
        for _, row in df.iterrows():
            item_id = row["ItemId"]
            isbn = row["ISBN13"]

            print(f"Fetching reviews for ItemId: {item_id}, ISBN: {isbn}")
            reviews = fetch_reviews(item_id)
=======
        output_data = []  # 수집된 데이터를 저장할 리스트
        for _, row in df.iterrows():
            item_id = row["ItemId"]  # ItemId 가져오기
            isbn = row["ISBN13"]  # ISBN 가져오기

            print(f"Fetching reviews for ItemId: {item_id}, ISBN: {isbn}")
            reviews = fetch_reviews(item_id)  # 리뷰 가져오기
>>>>>>> taeyoon

            # 리뷰 내용이 있는 경우만 저장
            for review in reviews:
                output_data.append(
                    {
<<<<<<< HEAD
                        "ISBN": isbn,
                        "review_content": review["review_content"],
                        "rating": review["rating"],
=======
                        "ISBN": isbn,  # ISBN 추가
                        "review_content": review["review_content"],  # 리뷰 내용
                        "rating": review["rating"],  # 별점
>>>>>>> taeyoon
                    }
                )

            # 요청 간 간격 두기
            time.sleep(1)

<<<<<<< HEAD
=======
        # 수집된 데이터를 CSV 파일로 저장
>>>>>>> taeyoon
        if output_data:
            output_df = pd.DataFrame(output_data)
            output_filename = os.path.basename(input_path).replace(
                ".csv", "_reviews.csv"
            )
            output_path = os.path.join(output_folder, output_filename)
            output_df.to_csv(output_path, index=False, encoding="utf-8-sig")
            print(f"Saved reviews to {output_path}")
        else:
            print(f"No reviews with content found for file {input_path}")


if __name__ == "__main__":
<<<<<<< HEAD
    input_folder = "./csv_books"
    output_folder = "./csv_reviews"
=======
    # 입력 폴더와 출력 폴더 경로 설정
    input_folder = "./csv_books"  # 입력 폴더
    output_folder = "./csv_reviews"  # 출력 폴더
    # 리뷰 추출 실행
>>>>>>> taeyoon
    extract_reviews(input_folder, output_folder)
