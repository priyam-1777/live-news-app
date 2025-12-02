from flask import Flask, render_template, request
import requests
import os
import random

app = Flask(__name__)

# Use environment variable for security
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("Please set your API_KEY environment variable!")

def fetch_news(query=None):
    """Fetch news from NewsAPI"""
    if query:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": query,
            "sortBy": "popularity",
            "pageSize": 20,
            "apiKey": API_KEY
        }
    else:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "country": "in",
            "pageSize": 20,
            "apiKey": API_KEY
        }

    response = requests.get(url, params=params)
    data = response.json()

    # Debug: print API response (optional)
    print(data)

    if data.get("status") != "ok":
        return []

    articles = data.get("articles", [])
    # Remove articles without title or URL
    articles = [a for a in articles if a.get("title") and a.get("url")]
    return articles

@app.route("/")
def home():
    # Show default news on homepage
    default_topics = ["politics", "wildlife", "technology", "science", "environment"]
    topic = random.choice(default_topics)
    articles = fetch_news(topic)
    return render_template("index.html", articles=articles, query="", search=False, message=None)

@app.route("/search")
def search():
    query = request.args.get("query", "").strip()
    if not query:
        # No query → show default news
        default_topics = ["politics", "wildlife", "technology", "science", "environment"]
        topic = random.choice(default_topics)
        articles = fetch_news(topic)
        return render_template("index.html", articles=articles, query="", search=False, message=None)

    articles = fetch_news(query)
    if not articles:
        message = f"No results found for '{query}', showing trending news."
        # Fallback default news
        default_topics = ["politics", "wildlife", "technology", "science", "environment"]
        topic = random.choice(default_topics)
        articles = fetch_news(topic)
    else:
        message = None

    return render_template("index.html", articles=articles, query=query, search=True, message=message)

@app.route("/favourites")
def favourites():
    return render_template("favourites.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


