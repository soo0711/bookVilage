import os
import numpy as np
from config import DEFAULT_MODEL_NAME  # 설정 파일에서 모델명 가져오기


def sanitize_filename(filename: str) -> str:
    """
    파일명이나 폴더명으로 사용할 수 없는 문자 제거
    """
    return (
        filename.replace("/", "_")
        .replace("\\", "_")
        .replace(":", "_")
        .replace("*", "_")
        .replace("?", "_")
        .replace('"', "_")
        .replace("<", "_")
        .replace(">", "_")
        .replace("|", "_")
    )


class PrecomputedRecommender:
    def __init__(self, model_name=None):
        # 모델명을 설정 파일에서 가져오거나, 인자로 전달된 모델명을 사용
        self.model_name = model_name or DEFAULT_MODEL_NAME
        self.embeddings = None
        self.similarities = None
        self.metadata = None
        self.load_model_files()

    def load_model_files(self):
        """
        지정된 모델의 임베딩, 유사도, 메타데이터 파일 로드
        """
        try:
            # 모델 이름을 안전한 경로로 변환
            safe_model_name = sanitize_filename(self.model_name)

            # 파일 경로 설정
            embeddings_dir = os.path.join("embeddings", safe_model_name)
            self.embeddings_file = os.path.join(embeddings_dir, "embeddings.npy")
            self.similarities_file = os.path.join(embeddings_dir, "similarities.npy")
            self.metadata_file = os.path.join(embeddings_dir, "book_metadata.npy")

            # 데이터 로드
            if not os.path.exists(self.embeddings_file):
                raise FileNotFoundError(
                    f"임베딩 파일이 존재하지 않습니다: {self.embeddings_file}"
                )
            if not os.path.exists(self.similarities_file):
                raise FileNotFoundError(
                    f"유사도 파일이 존재하지 않습니다: {self.similarities_file}"
                )
            if not os.path.exists(self.metadata_file):
                raise FileNotFoundError(
                    f"메타데이터 파일이 존재하지 않습니다: {self.metadata_file}"
                )

            self.embeddings = np.load(self.embeddings_file)
            self.similarities = np.load(self.similarities_file)
            self.metadata = np.load(self.metadata_file, allow_pickle=True)

        except Exception as e:
            print(f"모델 파일 로드 중 오류 발생: {e}")
            raise

    def update_model(self, model_name):
        """
        모델 이름 변경 및 데이터 로드
        """
        self.model_name = model_name
        self.load_model_files()

    def recommend(self, user_isbns, top_n=5):
        """
        사용자 읽은 책 기반 추천
        """
        # 모든 ISBN을 문자열로 변환
        user_isbns = [str(isbn) for isbn in user_isbns]
        metadata_isbns = [str(book["isbn13"]) for book in self.metadata]

        # 사용자 매칭된 인덱스 확인
        user_indices = [
            i
            for i, book in enumerate(self.metadata)
            if str(book["isbn13"]) in user_isbns
        ]
        print(f"사용자 매칭된 인덱스: {user_indices}")

        if not user_indices:
            print("사용자가 읽은 책을 찾을 수 없습니다.")
            return []

        # 유사도 합산
        user_similarity = np.sum(self.similarities[user_indices], axis=0)

        # 사용자 읽은 책 제외
        for idx in user_indices:
            user_similarity[idx] = -np.inf

        # 상위 N개의 책 추천
        top_indices = np.argsort(user_similarity)[::-1][:top_n]
        recommendations = [self.metadata[idx] for idx in top_indices]

        return recommendations
