#!/usr/bin/python
import os, sys, datetime, tarfile, os.path
from bson.json_util import dumps
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()
MONGO_URI = os.environ.get("MONGO_URI")
uri = MONGO_URI

client = MongoClient(uri, server_api=ServerApi("1"))
db = client["searchData"]
collection = db["all"]

filter_query = {"show": "SHOWKEY"}

count = collection.count_documents(filter_query)

# result = collection.delete_many(filter_query)
