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

# search multi
q = "feast"
show_name = "sunny"

pipeline = [
    {
        "$search": {
            "index": "lines",
            "compound": {
                "must": [{"text": {"query": show_name, "path": "show"}}],
                "filter": [{"text": {"query": q, "path": "content"}}],
            },
        },
    },
    {"$limit": 20},
]


result = client["searchData"]["all"].aggregate(pipeline)

output = []
for item in result:
    output.append(
        {
            "show": item["show"],
            "line_number": item["line_number"],
            "episode_id": item["episode_id"],
            "timecode": item["timecode"],
            "content": item["content"],
        }
    )

print(output)


# rename a collection
# db = client["dev"]
# collection = db["sunny_dev"]

# results = collection.rename("sunny")


# distinct shows
# db = client["searchData"]

# print(db.all.distinct("show"))
