import os
import shutil
import configparser
from git import Repo

repo_url = "https://github.com/Maks1mio/YMusic-DRPC.git"
local_path = "YMusic-DRPC"
version_file = os.path.join(local_path, "YandexDiscordRPC", "version.ini")

def update_repository():
    if os.path.exists(local_path):
        repo = Repo(local_path)
        origin = repo.remote(name='origin')

        # Проверьте, есть ли изменения после fetch
        print("Checking for changes after fetch...")
        origin.fetch()

        latest_tag = repo.tags[-1].name
        current_version = get_current_version()

        if current_version != latest_tag:
            update_version_file(latest_tag)
            print("Updating version.ini only...")
        else:
            print("No changes in version, skipping update.")

def get_current_version():
    config = configparser.ConfigParser()
    if os.path.exists(version_file):
        config.read(version_file)
        current_version = config.get('Version', 'version', fallback='0.0.0')
        print({'current version: ': current_version})
        return current_version
    return "0.0.0"

def update_version_file(version):
    config = configparser.ConfigParser()
    config['Version'] = {'version': version}
    with open(version_file, 'w') as config_file:
        config.write(config_file)
        print(f"Updated version to: {version}")

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
