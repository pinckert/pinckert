from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "<h1>pinckert.com</h1><p>Development site is running.</p>"


if __name__ == "__main__":
    app.run(debug=True)