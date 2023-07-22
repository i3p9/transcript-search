# import json

# f = open("episode_data_office.json")

# data = json.load(f)


# keylist = data.keys()  # this is of type `dict_key`, NOT a `list`

# keylisttype = list(keylist)

# keylisttype.sort()

# print(keylisttype)

# with open("your_file.txt", "w") as f:
#     for line in keylisttype:
#         f.write("%s\n" % line)

import os

sub_path = f"{os.getcwd()}/new/"
list_of_files = os.listdir(sub_path)

print(len(list_of_files))
