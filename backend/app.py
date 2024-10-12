from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')
stop_words = stopwords.words('english')

app = Flask(__name__)
CORS(app)  

newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data

vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
term_doc_matrix = vectorizer.fit_transform(documents)

num_components = 100
svd_model = TruncatedSVD(n_components=num_components)
lsa_matrix = svd_model.fit_transform(term_doc_matrix)

def search_engine(query):
    query_tfidf = vectorizer.transform([query])
    query_reduced = svd_model.transform(query_tfidf)

    similarities = cosine_similarity(lsa_matrix, query_reduced).flatten()

    top_indices = similarities.argsort()[::-1][:5]
    top_indices = [int(i) for i in top_indices]  # Convert to Python int

    top_similarities = [float(similarities[i]) for i in top_indices]

    results = []
    for idx, sim in zip(top_indices, top_similarities):
        results.append({
            'document': documents[idx],
            'similarity': sim,
            'doc_index': idx
        })
    
    return results

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '')
    results = search_engine(query)
    print("Results being returned:", results) 
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)