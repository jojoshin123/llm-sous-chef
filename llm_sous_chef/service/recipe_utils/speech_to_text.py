from groq import Groq

# Initialize the Groq client
client = Groq()

def get_transcription(audio_filename):
    # Open the flac audio file
    with open(audio_filename + ".flac", "rb") as file:
        # Create a transcription of the audio file
        transcription = client.audio.transcriptions.create(
          file=file,  # Required audio file
          model="whisper-large-v3-turbo", # Required model to use for transcription
          prompt="Specify context or spelling",  # Optional
          response_format="json",  # Optional
          language="en",  # Optional
          temperature=0.0  # Optional
        )
        # To print only the transcription text, you'd use print(transcription.text)
        # print(transcription.text)
        return transcription.text
