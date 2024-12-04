from pydantic import BaseModel
from typing import List, Optional


class BookDetails(BaseModel):
    id: int
    isbn: str
    title: str
    description: Optional[str]
    cover: Optional[str]
    author: str
    publisher: Optional[str]
    category: Optional[str]
    publication: Optional[str]
    createdAt: str


class RecommendationResponse(BaseModel):
    user_id: int
    recommended_books: List[BookDetails]
