from flask import Flask, render_template, request
import requests

app = Flask(__name__)

API_KEY = "2df1633667474313ad3aa33a829f302f"

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

    # Debug: print the response to check errors
    print(data)

    if data.get("status") != "ok":
        return []

    articles = data.get("articles", [])
    # Remove articles without title or URL
    articles = [a for a in articles if a.get("title") and a.get("url")]
    return articles

@app.route("/")
def home():
    articles = fetch_news()  # default trending news
    return render_template("index.html", articles=articles, query="", search=False, message=None)

@app.route("/search")
def search():
    query = request.args.get("query", "").strip()
    if not query:
        return render_template("index.html", articles=fetch_news(), query="", search=False, message=None)

    articles = fetch_news(query)
    if not articles:
        message = f"No results found for '{query}', showing trending news."
        articles = fetch_news()
    else:
        message = None

    return render_template("index.html", articles=articles, query=query, search=True, message=message)

@app.route("/favourites")
def favourites():
    return render_template("favourites.html")

# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

