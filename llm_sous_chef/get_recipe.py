from groq import Groq

client = Groq()

def get_recipe(video_data):
    # Create a transcription of the audio file
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
                "content": """
                Using this metadata and transcription of a cooking TikTok, please generate a recipe.
                I want you to return this recipe as a JSON object.
                Please ONLY respond with:
                1. A key "title" with a title string as a value.
                2. A key "description" with an 2-3 brief description string as a value.
                3. A key "ingredients" with a list of ingredients and quantity needed.
                4. A key "instructions" with a list of detailed instructions.
                """ + str(video_data),
            }
        ],
        model="llama-3.3-70b-versatile", # Required model to use for transcription
    )

    return chat_completion.choices[0].message.content