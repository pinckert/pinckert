from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>pinckert.com</title>

        <style>
            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;

                font-family: -apple-system, BlinkMacSystemFont,
                             "Segoe UI", Arial, sans-serif;

                background: #f4f4f2;
                color: #333;
            }

            main {
                width: 90%;
                max-width: 700px;
                text-align: center;
                padding: 60px 30px;
            }

            h1 {
                margin: 0 0 12px;
                font-size: 3rem;
                font-weight: 500;
                letter-spacing: -1px;
            }

            .rule {
                width: 60px;
                height: 2px;
                margin: 24px auto;
                background: #777;
            }

            p {
                margin: 8px 0;
                font-size: 1.15rem;
                line-height: 1.6;
                color: #666;
            }

            .note {
                margin-top: 32px;
                font-size: 0.9rem;
                color: #999;
            }
        </style>
    </head>

    <body>
        <main>
            <h1>pinckert.com</h1>

            <div class="rule"></div>

            <p>This site is currently being rebuilt.</p>

            <p>
                A new version is under development and will
                begin appearing here soon.
            </p>

            <div class="note">
                Thanks for stopping by.
            </div>
        </main>
    </body>
    </html>
    """


if __name__ == "__main__":
    app.run(debug=True)