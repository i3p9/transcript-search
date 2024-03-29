import os
import re
from dotenv import load_dotenv

load_dotenv()

FOLDER_NAME = os.environ.get("FOLDER_NAME")
folder_path = f"{os.getcwd()}/{FOLDER_NAME}/"  # folder path
pattern = r"(S\d+)(E\d+)"  # regex match "Sxx" and "Exx"

for filename in os.listdir(folder_path):
    if filename.endswith(".srt"):  # only process .srt, NOT the video files
        print(f"processing: {filename}")
        match = re.search(pattern, filename)
        if match:
            season = match.group(1)[1:]
            episode = match.group(2)[1:]

            new_filename = f"S{season}E{episode}.txt"

            original_file_path = os.path.join(folder_path, filename)
            new_file_path = os.path.join(folder_path, new_filename)

            os.rename(original_file_path, new_file_path)

            print(f"Renamed file: {original_file_path} to {new_file_path}")
