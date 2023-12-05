import os
import shutil
import json
from git import Repo

repo_url = "https://github.com/Maks1mio/YMusic-DRPC.git"
local_path = "YMusic-DRPC"
version_file = os.path.join(local_path, "YandexDiscordRPC", "version.json")

def update_repository():
    if os.path.exists(local_path):
        repo = Repo(local_path)
        origin = repo.remote(name='origin')

        origin.fetch()

        latest_tag = repo.tags[-1].name

        current_version = get_current_version()

        if current_version != latest_tag:
            repo.head.reset(index=True, working_tree=True)
            origin.pull(latest_tag)
            update_version_file(latest_tag)

def get_current_version():
    if os.path.exists(version_file):
        with open(version_file, 'r') as file:
            data = json.load(file)
            return data.get('version', '')
    return ""

def update_version_file(version):
    data = {'version': version}
    with open(version_file, 'w') as file:
        json.dump(data, file)

def copy_files():
    source_dir = os.path.join(local_path, "YandexDiscordRPC")
    target_dir = "YandexDiscordRPC"

    if os.path.exists(source_dir):
        for filename in os.listdir(source_dir):
            source_file = os.path.join(source_dir, filename)
            target_file = os.path.join(target_dir, filename)

            if os.path.isfile(source_file):
                shutil.copy2(source_file, target_file)

def main():
    update_repository()
    copy_files()

if __name__ == "__main__":
    main()
