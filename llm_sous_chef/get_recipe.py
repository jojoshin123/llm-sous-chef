from groq import Groq

client = Groq()

def get_recipe(video_data):
    # Create a transcription of the audio file
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an assistant tasked to summarize cooking recipes from social media content."
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": """
                Using this metadata and transcription of a cooking TikTok, please generate a recipe. 
                Please ONLY respond with ingredients and instructions.
                """ + str(video_data),
            }
        ],
        model="llama-3.3-70b-versatile", # Required model to use for transcription
    )

    return chat_completion.choices[0].message.content