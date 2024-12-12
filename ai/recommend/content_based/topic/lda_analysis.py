from gensim import corpora, models
from utils import preprocess_review, extract_nouns


# LDA 분석 및 데이터 저장
def perform_lda(reviews, stopwords):
    processed_reviews = [
        extract_nouns(preprocess_review(review.review_content), stopwords)
        for review in reviews
    ]
    dictionary = corpora.Dictionary(processed_reviews)
    corpus = [dictionary.doc2bow(text) for text in processed_reviews]
    lda_model = models.LdaModel(
        corpus, id2word=dictionary, num_topics=10, passes=10, iterations=50
    )
    topics = lda_model.show_topics(num_topics=10, num_words=15, formatted=False)

    word_weights = {}
    for topic in topics:
        for word, weight in topic[1]:
            word_weights[word] = word_weights.get(word, 0) + weight
    return processed_reviews, word_weights
