from groq import Groq

client = Groq()

def get_recipe(video_data, recipe_url):
    # Create a transcription of the audio file
    print(f"recipe_url:{recipe_url}")
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                    You are an assistant tasked to summarize cooking recipes from social media content.
                    These recipes are meant for home cooking and should be relatively simple without sacrificing quality.
                    """
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": f"""
                Using this metadata and transcription of a cooking TikTok, please generate a recipe.
                I want you to return this recipe as a JSON object in the format specified below.
                {{
                    "url", {recipe_url}, (LEAVE THIS URL AS IS)
                    "description": "",
                    "ingredients": [""] (These should contain both the ingredient QUANTITY and NAME.
                            If quantity is not mentioned in the video metadata, then please generate your own quantities
                            based on similar recipes.)
                    "instructions": [],
                    "title": ""
                }}
                If the URL seems irrelevant or does not look like a recipe URL, or if the resulting recipe is completely empty,
                please simply leave the \"ingredients\" and \"instructions\" values as empty lists.
                """ + str(video_data),
            }
        ],
        model="llama-3.3-70b-versatile", # Required model to use for transcription
        response_format={ "type": "json_object" }
    )

    return chat_completion.choices[0].message.content
