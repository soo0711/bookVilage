from wordcloud import WordCloud
import matplotlib.pyplot as plt


def generate_wordcloud(lda_model, dictionary, num_words=10):
    topics = lda_model.show_topics(num_words=num_words, formatted=False)
    word_weights = {}

    for topic in topics:
        for word, weight in topic[1]:
            if word in word_weights:
                word_weights[word] += weight
            else:
                word_weights[word] = weight

    wordcloud = WordCloud(
        font_path="C:\Windows\Fonts\malgun.ttf",
        width=800,
        height=400,
        background_color="white",
    ).generate_from_frequencies(word_weights)

    plt.figure(figsize=(10, 6))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    return wordcloud
