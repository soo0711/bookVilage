import gzip
import shutil
import os

# 압축할 디렉터리 경로
directory = (
    "C:/p_project/bookVillage/ai/recommend/content_based/embeddings/klue_bert-base"
)

# 디렉터리 내 모든 .npy 파일 압축
for file_name in os.listdir(directory):
    if file_name.endswith(".npy"):
        original_file = os.path.join(directory, file_name)
        compressed_file = original_file + ".gz"

        # 압축 실행
        with open(original_file, "rb") as f_in:
            with gzip.open(compressed_file, "wb") as f_out:
                shutil.copyfileobj(f_in, f_out)

        print(f"압축 완료: {compressed_file}")
