import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.environ.get("MONGO_URI")


def write_to_db(items: list, current: int, total: int):
    from pymongo.mongo_client import MongoClient
    from pymongo.server_api import ServerApi

    uri = MONGO_URI

    client = MongoClient(uri, server_api=ServerApi("1"))

    # # ping db
    # try:
    #     client.admin.command("ping")
    #     print("Pinged your deployment. You successfully connected to MongoDB!")
    # except Exception as e:
    #     print(e)

    db = client["dev"]
    collection = db["sunny"]
    result = collection.insert_many(items)
    if result.acknowledged == True:
        print(f"{current} of {total} inserted successfully")


def process_subfile(data_list: list, episode_id: str) -> list:
    result = []
    current_dict = None

    for item in data_list:
        if item.isdigit():
            if current_dict is not None:
                result.append(current_dict)

            current_dict = {
                "episode_id": episode_id,
                "line_number": int(item),
                "timecode": None,
                "content": [],
            }
        elif current_dict is not None:
            if current_dict["timecode"] is None:
                current_dict["timecode"] = item
            else:
                current_dict["content"].append(item)

    for item in result:
        item["content"] = "\n".join(item["content"])

    # Add the last dictionary to the result
    if current_dict is not None:
        result.append(current_dict)

    return result


sub_path = f"{os.getcwd()}/migrations/sunny/"
list_of_files = os.listdir(sub_path)

for i in range(0, len(list_of_files)):
    list_of_files[i] = f"{sub_path}{list_of_files[i]}"

processed_files = []
total_episodes = len(list_of_files)
x = 1
for file in list_of_files:
    with open(file=file) as f:
        contents = []
        file_contents = f.readlines()
        f.close()
    for line in file_contents:
        contents.append(line.strip())

    data_list = list(filter(lambda x: x != "", contents))

    processed = process_subfile(
        data_list=data_list,
        episode_id=os.path.basename(file).strip(".txt"),
    )

    write_to_db(processed, current=x, total=total_episodes)
    x = x + 1
