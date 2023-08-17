import os, json
from dotenv import load_dotenv

load_dotenv()

FOLDER_NAME = os.environ.get("FOLDER_NAME")


def process_subfile(data_list: list, episode_id: str, show_key: str) -> list:
    result = []
    current_dict = None

    for item in data_list:
        if item.isdigit():
            if current_dict is not None:
                result.append(current_dict)

            current_dict = {
                "show": show_key,
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


show_key = os.environ.get("SHOW_KEY")
sub_path = f"{os.getcwd()}/{FOLDER_NAME}/"
list_of_files = os.listdir(sub_path)

for i in range(0, len(list_of_files)):
    list_of_files[i] = f"{sub_path}{list_of_files[i]}"

processed_files = []
total = len(list_of_files)
x = 1

try:
    os.mkdir(f"/Users/fahim/git/transcript-search/migrations/{FOLDER_NAME}_json")
except FileExistsError:
    print(f"{FOLDER_NAME}_json already exists")


for file in list_of_files:
    print(file)
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
        show_key=show_key,
    )

    # print(processed)
    fname = os.path.basename(file).strip(".txt")
    output_file = (
        f"/Users/fahim/git/transcript-search/migrations/{FOLDER_NAME}_json/{fname}.json"
    )
    with open(output_file, "w") as file:
        json.dump(processed, file)
        print(f"wrote {x} of {total} files")
    file.close()
    x += 1
