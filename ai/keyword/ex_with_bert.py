import os
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import pairwise_distances_argmin_min

# 데이터 로드
file_path = "merged_data_without_duplicates.csv"
data = pd.read_csv(file_path)

# 리뷰 데이터 전처리: "리뷰 없음" 제거
data = data[data["review_content"] != "리뷰 없음"]

# 리뷰 데이터를 리스트로 변환
sentences = data["review_content"].tolist()

# SentenceTransformer 모델 로드 (GPU 사용)
model = SentenceTransformer("monologg/kobert", device="cuda", trust_remote_code=True)

# 임베딩 파일 경로 설정
embedding_file = "sentence_embeddings.npy"

if os.path.exists(embedding_file):
    # 저장된 임베딩 로드
    print("Loading precomputed embeddings...")
    sentence_embeddings = np.load(embedding_file)
else:
    # 문장 임베딩 생성 (GPU 사용)
    print("Computing embeddings on GPU...")
    sentence_embeddings = model.encode(sentences, batch_size=32, show_progress_bar=True)
    # 임베딩 저장
    np.save(embedding_file, sentence_embeddings)
    print(f"Embeddings saved to {embedding_file}")

# KMeans 클러스터링
num_clusters = 10  # 군집 수 설정
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
kmeans.fit(sentence_embeddings)

# 각 문장에 대한 클러스터 라벨 할당
data["cluster"] = kmeans.labels_


# 클러스터 내 대표 문장 선정 함수
def get_representative_sentences_with_tfidf(sentences, embeddings, labels):
    vectorizer = TfidfVectorizer(max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(sentences)

    cluster_representatives = {}
    for cluster_id in set(labels):
        cluster_indices = [i for i, label in enumerate(labels) if label == cluster_id]
        cluster_sentences = [sentences[i] for i in cluster_indices]
        cluster_tfidf = tfidf_matrix[cluster_indices]

        # TF-IDF 기반으로 높은 점수의 문장 선택
        best_index_tfidf = cluster_tfidf.mean(axis=0).argmax()  # 평균 TF-IDF 계산
        representative_tfidf = (
            cluster_sentences[best_index_tfidf]
            if len(cluster_sentences) > best_index_tfidf
            else cluster_sentences[0]
        )

        # 중심에 가까운 문장 선택
        cluster_embeddings = embeddings[cluster_indices]
        centroid = kmeans.cluster_centers_[cluster_id]
        closest_index, _ = pairwise_distances_argmin_min([centroid], cluster_embeddings)
        representative_centroid = cluster_sentences[closest_index[0]]

        # 간결한 문장 선택 (50자 이내)
        filtered_sentences = [s for s in cluster_sentences if 10 <= len(s) <= 50]
        if filtered_sentences:
            representative_short = sorted(filtered_sentences, key=len)[0]
        else:
            representative_short = (
                representative_tfidf  # 기본값으로 TF-IDF 대표 문장 사용
            )

        # 대표 문장 최종 선정
        cluster_representatives[cluster_id] = representative_short
    return cluster_representatives


# 대표 문장 추출
representative_sentences = get_representative_sentences_with_tfidf(
    sentences, sentence_embeddings, kmeans.labels_
)

# 결과 출력
print("Cluster Representatives:")
for cluster_id, sentence in representative_sentences.items():
    print(f"Cluster {cluster_id}: {sentence}")

# 결과 CSV로 저장
output_file = "cluster_representative_sentences.csv"
pd.DataFrame(
    representative_sentences.items(), columns=["Cluster", "Representative Sentence"]
).to_csv(output_file, index=False)
print(f"Results saved to {output_file}")
