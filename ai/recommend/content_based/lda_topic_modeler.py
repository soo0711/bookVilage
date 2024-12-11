from konlpy.tag import Okt
from gensim import corpora, models
from wordcloud import WordCloud
import re
import matplotlib.pyplot as plt
import matplotlib

# matplotlib의 백엔드를 "Agg"로 설정하여 GUI 없이 작동
matplotlib.use("Agg")


class LDATopicModeler:
    def __init__(self, num_topics=10, stopwords=None):
        """
        LDA 토픽 모델링 클래스 초기화
        """
        self.num_topics = num_topics
        self.okt = Okt()
        self.stopwords = stopwords or [
            "의",
            "가",
            "이",
            "은",
            "들",
            "는",
            "좀",
            "잘",
            "걍",
            "과",
            "도",
            "를",
            "으로",
            "자",
            "에",
            "와",
            "한",
            "하다",
            "것",
            "라고",
            "에게",
            "라면",
            "을",
            "이라",
            "라니",
            "있다",
            "아",
            "랑",
            "쯤된",
            "에서",
            "에선",
            "어",
            "이지만",
            "으로나",
            "때",
            "때는",
            "때라면",
            "때라서",
            "라",
            "이다",
            "있",
            "죠",
            "고",
            "니",
            "로",
            "같",
            "어서",
            "어요",
            "는데",
            "습니다",
            "면서",
            "많이",
            "마",
            "더",
            "그렇다",
            "안",
            "정말",
            "같다",
            "임",
            "만",
            "인",
            "그",
            "저",
            "수",
            "거",
            "책",
            "리뷰",
            "작가",
            "소설",
        ]

    def preprocess_review(self, review):
        """
        리뷰 데이터를 전처리하여 한글과 공백만 남기기
        """
        return re.sub(r"[^가-힣\s]", "", str(review))

    def extract_nouns(self, text):
        """
        리뷰에서 명사만 추출하고 불용어 제거
        """
        return [word for word in self.okt.nouns(text) if word not in self.stopwords]

    def train_lda(self, reviews):
        """
        LDA 모델을 학습
        """
        # 리뷰 전처리 및 명사 추출
        preprocessed_reviews = [
            self.extract_nouns(self.preprocess_review(r)) for r in reviews if r.strip()
        ]
        if not preprocessed_reviews:
            raise ValueError("Cannot train LDA on an empty dataset.")

        # Gensim 데이터 준비
        dictionary = corpora.Dictionary(preprocessed_reviews)
        corpus = [dictionary.doc2bow(text) for text in preprocessed_reviews]

        # LDA 모델 학습
        lda_model = models.LdaModel(
            corpus=corpus,
            id2word=dictionary,
            num_topics=self.num_topics,
            random_state=42,
            passes=10,
            iterations=50,
        )
        return lda_model, dictionary, corpus

    def generate_wordcloud(self, lda_model, dictionary, corpus, save_path):
        """
        LDA 모델에서 WordCloud 생성 및 저장
        """
        topics = lda_model.show_topics(
            num_topics=self.num_topics, num_words=20, formatted=False
        )
        word_weights = {}
        for topic_id, words in topics:
            for word, weight in words:
                word_weights[word] = word_weights.get(word, 0) + weight

        # WordCloud 생성
        wordcloud = WordCloud(
            font_path="C:/Windows/Fonts/malgun.ttf",  # Windows용 한글 폰트 경로
            width=800,
            height=400,
            background_color="white",
        ).generate_from_frequencies(word_weights)

        # WordCloud 이미지 저장
        plt.figure(figsize=(10, 6))
        plt.imshow(wordcloud, interpolation="bilinear")
        plt.axis("off")
        plt.savefig(save_path)
        plt.close()
