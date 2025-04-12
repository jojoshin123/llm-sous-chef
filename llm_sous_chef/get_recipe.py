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
                I want you to return this recipe as a JSON object in the format specified below.
                {
                    "description": "",
                    "ingredients": [
                        {
                            "ingredient": "" (This should contain both the ingredient quantity and name.)
                        }
                    ],
                    "instructions": [],
                    "title": ""
                }
                
                """ + str(video_data),
            }
        ],
        model="llama-3.3-70b-versatile", # Required model to use for transcription
        response_format={ "type": "json_object" }
    )

    return chat_completion.choices[0].message.content
