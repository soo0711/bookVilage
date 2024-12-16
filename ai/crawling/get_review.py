import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# AJAX 요청 URL
URL = "https://www.aladin.co.kr/ucl/shop/product/ajax/GetCommunityListAjax.aspx"


# 리뷰를 수집하는 함수
def fetch_reviews(item_id):
    params = {
        "ProductItemId": item_id,
        "itemId": item_id,
        "pageCount": 25,  # 한 번에 가져올 리뷰 수
        "communitytype": "CommentReview",
        "nemoType": -1,
        "page": 1,
        "startNumber": 1,
        "endNumber": 10,
        "sort": 2,
        "IsOrderer": 1,
        "BranchType": 1,
        "IsAjax": "true",
        "pageType": 0,
    }
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

        if not review_items:
            print(f"ItemId {item_id}: 모든 리뷰를 가져왔습니다.")
            break

        for item in review_items:
            # 별점 추출
            star_section = item.find("div", class_="HL_star")
            if star_section:
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
                if (
                    "style" not in content.attrs
                    or "display:none" not in content.attrs["style"]
                ):
                    content_text = content.get_text(strip=True)
                    break

            # 리뷰 내용이 있는 경우만 추가
            if content_text and content_text != "리뷰 내용 없음":
                print(f"Rating: {star_count}, Review: {content_text}")  # 출력
                reviews.append(
                    {
                        "rating": star_count,
                        "review_content": content_text,
                    }
                )

        # 다음 페이지로 이동
        params["page"] += 1
        params["startNumber"] += params["pageCount"]
        params["endNumber"] += params["pageCount"]

    return reviews


# 입력 폴더의 파일을 읽고 리뷰를 수집 및 저장
def extract_reviews(input_folder, output_folder):
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

        if "ItemId" not in df.columns or "ISBN13" not in df.columns:
            print(
                f"File {input_path} does not contain required columns (ItemId, ISBN13)."
            )
            continue

        output_data = []
        for _, row in df.iterrows():
            item_id = row["ItemId"]
            isbn = row["ISBN13"]

            print(f"Fetching reviews for ItemId: {item_id}, ISBN: {isbn}")
            reviews = fetch_reviews(item_id)

            # 리뷰 내용이 있는 경우만 저장
            for review in reviews:
                output_data.append(
                    {
                        "ISBN": isbn,
                        "review_content": review["review_content"],
                        "rating": review["rating"],
                    }
                )

            # 요청 간 간격 두기
            time.sleep(1)

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
    input_folder = "./csv_books"
    output_folder = "./csv_reviews"
    extract_reviews(input_folder, output_folder)
