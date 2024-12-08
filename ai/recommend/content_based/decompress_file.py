import gzip
import os
import shutil

# 압축할 디렉터리 경로
directory = (
    "C:/p_project/bookVillage/ai/recommend/content_based/embeddings/klue_bert-base"
)

for file_name in os.listdir(directory):
    if file_name.endswith(".npy.gz"):
        compressed_file = os.path.join(directory, file_name)
        decompressed_file = compressed_file.replace(".gz", "")

        # 압축 해제
        with gzip.open(compressed_file, "rb") as f_in:
            with open(decompressed_file, "wb") as f_out:
                shutil.copyfileobj(f_in, f_out)

        print(f"압축 해제 완료: {decompressed_file}")
