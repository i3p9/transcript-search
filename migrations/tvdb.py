import os
import re
import time
import json
from dotenv import load_dotenv

load_dotenv()
TVDB_API = os.environ.get("TVDB_API")


def get_episode_data(season, episode, current, total):
    import requests

    api_key = TVDB_API
    url = f"https://api.themoviedb.org/3/tv/48891/season/{season}/episode/{episode}?api_key={api_key}&language=en-US"

    payload = {}
    headers = {}
    episode_id = f"S{season}E{episode}"

    response = requests.request("GET", url, headers=headers, data=payload)
    jsonResponse = response.json()
    print(jsonResponse)
    print(f"{current} of {total} processed successfully")
    return {
        episode_id: {
            "name": jsonResponse["name"],
            "tvdb_id": jsonResponse["id"],
            "overview": jsonResponse["overview"],
        }
    }


sub_path = f"{os.getcwd()}/b99_hi_48891/"  # put path to subs folder here
list_of_files = os.listdir(sub_path)
pattern = r"(S\d+)(E\d+)"

for i in range(0, len(list_of_files)):
    list_of_files[i] = list_of_files[i].strip(".txt")

total_episodes = len(list_of_files)
out = {}
current = 1
for file in list_of_files:
    match = re.search(pattern, file)
    if match:
        season = match.group(1)[1:]
        episode = match.group(2)[1:]

        data = get_episode_data(
            season=season, episode=episode, current=current, total=total_episodes
        )
        out.update(data)
        time.sleep(1)
        current += 1

output_file = "episode_data_b99.json"
with open(output_file, "w") as file:
    json.dump(out, file)

print(f"JSON data saved to {output_file}")
