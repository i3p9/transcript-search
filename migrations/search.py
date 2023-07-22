import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.json_util import dumps, loads
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.environ.get("MONGO_URI")


uri = MONGO_URI

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["dev"]
collection = db["sunny_dev"]

results = collection.rename("sunny")

# episode_id = "S01E03"
# line_number = 20

# if line_number:
#     if line_number > 1:
#         context_lines = [line_number - 1, int(line_number), line_number + 1]
#     else:
#         context_lines = [int(line_number), line_number + 1]
# else:
#     print("line_number is a required field")

# if episode_id:
#     print("quuq")
#     query = {"episode_id": episode_id, "line_number": {"$in": context_lines}}
#     results = collection.find(query)
#     output = []
#     for item in results:
#         output.append(
#             {
#                 "line_number": item["line_number"],
#                 "episode_id": item["episode_id"],
#                 "timecode": item["timecode"],
#                 "content": item["content"],
#             }
#         )

#     print(output)

# else:
#     print("ep_id is a required field")
