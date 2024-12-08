import os
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sqlalchemy.orm import Session
from models import Book
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


class PrecomputeEmbeddings:
    def __init__(
        self,
        model_name=DEFAULT_MODEL_NAME,
        batch_size=16,
        max_length=256,
    ):
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name, trust_remote_code=True
        )
        self.model = AutoModel.from_pretrained(model_name, trust_remote_code=True)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.batch_size = batch_size
        self.max_length = max_length

    def preprocess_books(self, books):
        """
        책 데이터를 텍스트 형태로 변환
        """
        processed_texts = []
        for book in books:
            text = (
                f"제목: {book.title}, 저자: {book.author}, 출판사: {book.publisher}, "
                f"카테고리: {book.category}, 설명: {book.description or ''}"
            )
            processed_texts.append(text)
        return processed_texts

    def get_embeddings(self, texts):
        """
        주어진 텍스트의 임베딩 벡터 계산
        """
        all_embeddings = []
        for i in range(0, len(texts), self.batch_size):
            batch_texts = texts[i : i + self.batch_size]
            inputs = self.tokenizer(
                batch_texts,
                padding=True,
                truncation=True,
                return_tensors="pt",
                max_length=self.max_length,
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model(**inputs)

            # [CLS] 토큰의 벡터를 사용
            batch_embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
            all_embeddings.append(batch_embeddings)
            torch.cuda.empty_cache()

        return np.vstack(all_embeddings)

    def save_embeddings_and_similarities(
        self,
        db: Session,
        embeddings_file="embeddings.npy",
        similarities_file="similarities.npy",
    ):
        """
        책 데이터를 기반으로 임베딩 벡터와 유사도 행렬 저장
        """
        all_books = db.query(Book).all()

        if not all_books:
            print("데이터베이스에서 Book 데이터를 가져오지 못했습니다.")
            return

        all_texts = self.preprocess_books(all_books)
        if not all_texts:
            print("책 데이터가 비어 있습니다. 임베딩 생성을 중단합니다.")
            return

        # 임베딩 계산
        embeddings = self.get_embeddings(all_texts)

        # 코사인 유사도를 기반으로 유사도 행렬 계산
        norm_embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
        similarities = np.dot(norm_embeddings, norm_embeddings.T)

        # 저장 디렉토리 확인 및 생성
        os.makedirs(os.path.dirname(embeddings_file), exist_ok=True)

        # 임베딩과 유사도 저장
        np.save(embeddings_file, embeddings)
        np.save(similarities_file, similarities)

        # 메타데이터 저장
        metadata_file = os.path.join(
            os.path.dirname(embeddings_file), "book_metadata.npy"
        )
        book_metadata = [
            {
                "isbn13": book.isbn13,
                "title": book.title,
                "description": book.description,
                "cover": book.cover,
                "author": book.author,
                "publisher": book.publisher,
                "category": book.category,
                "publication": book.pubdate.isoformat() if book.pubdate else None,
            }
            for book in all_books
        ]
        np.save(metadata_file, book_metadata)

        print("임베딩, 유사도 및 메타데이터 저장 완료")
