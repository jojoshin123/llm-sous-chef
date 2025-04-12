import json
import os
import yt_dlp
import subprocess
import uuid
import tempfile

from llm_sous_chef.speech_to_text import get_transcription


def download_video(url: str):
    # Init temp directory and name for output file
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_output_filename = os.path.join(temp_dir, str(uuid.uuid4()))

        ydl_opts = {
            "outtmpl": temp_output_filename + ".mp4",
            "format": "bestvideo+bestaudio/best",
            "writeinfojson": True,
            "quiet": False,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        with open(temp_output_filename + ".info.json", "rb") as file:
            data = json.load(file)

        # Get audio form of video
        extract_audio(temp_output_filename)
        # Get transcription of video
        transcription = get_transcription(temp_output_filename)

        return {
            "uuid": temp_output_filename,
            "title": data["title"],
            "description": data["description"],
            "transcription": transcription
        }


def extract_audio(temp_filename):
    subprocess.run([
        "ffmpeg", "-i", temp_filename + ".mp4",
        "-vn",              # no video
        "-ar", "16000",     # sample rate for Whisper
        "-ac", "1",         # mono,
        "-c:a", "flac",
        temp_filename + ".flac"
    ], check=True)
