from flask import Flask, render_template, request
import requests
import os
import random

app = Flask(__name__)

API_KEY = os.getenv("API_KEY")
# API_KEY = "2df1633667474313ad3aa33a829f302f"
if not API_KEY:
    raise ValueError("Please set your API_KEY environment variable!")

def fetch_news(query=None):
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

    if data.get("status") != "ok":
        return []

    articles = data.get("articles", [])
    return [a for a in articles if a.get("title") and a.get("url")]

@app.route("/")
def home():
    default_topics = ["politics", "wildlife", "technology", "science", "environment"]
    topic = random.choice(default_topics)
    articles = fetch_news(topic)
    return render_template("index.html", articles=articles, query="", search=False, message=None)

@app.route("/search")
def search():
    query = request.args.get("query", "").strip()
    if not query:
        return home()

    articles = fetch_news(query)
    message = None

    if not articles:
        message = f"No results found for '{query}', showing trending news."
        return render_template("index.html", articles=fetch_news(random.choice(["politics","science","sports"])),
                               query=query, search=True, message=message)

    return render_template("index.html", articles=articles, query=query, search=True, message=None)

@app.route("/favourites")
def favourites():
    return render_template("favourites.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


