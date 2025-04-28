from llm_sous_chef import create_app

app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)