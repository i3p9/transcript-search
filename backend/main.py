from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import dotenv_values
from bson.json_util import dumps

config = dotenv_values(".env")
app = FastAPI()

uri = config["MONGO_URI"]
accepted_key = config["ACCEPTED_KEY"]

client = MongoClient(uri, server_api=ServerApi("1"))
db = client["dev"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# TODO: Add Auth
@app.get("/{show}/search/")
def search(q: str, limit: int, auth: str, show: str):
    if auth != accepted_key:
        return {"message": "auth required"}
    pipeline = [
        {
            "$search": {
                "index": "lines",
                "text": {"query": q, "path": {"wildcard": "*"}},
            },
        },
        {"$limit": limit},
    ]

    if limit > 20:
        return {"message": "Max limit is 20"}

    result = client["dev"][show].aggregate(pipeline)
    output = []
    for item in result:
        output.append(
            {
                "line_number": item["line_number"],
                "episode_id": item["episode_id"],
                "timecode": item["timecode"],
                "content": item["content"],
            }
        )

    return output


@app.get("/{show}/context/")
def search(episode_id: str, line_number: int, auth: str, show: str):
    if auth != accepted_key:
        return {"message": "auth required/failed"}

    if line_number:
        if line_number > 1:
            context_lines = [line_number - 1, int(line_number), line_number + 1]
        else:
            context_lines = [int(line_number), line_number + 1]
    else:
        return {"message": "line_number is a required field"}

    if episode_id:
        query = {"episode_id": episode_id, "line_number": {"$in": context_lines}}
        collection = db[show]
        results = collection.find(query)
        output = []
        for item in results:
            output.append(
                {
                    "line_number": item["line_number"],
                    "episode_id": item["episode_id"],
                    "timecode": item["timecode"],
                    "content": item["content"],
                }
            )

        return output

    else:
        return {"message": "line_number is a required field"}


@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    return {"message": "all OK"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
