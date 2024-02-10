import os
import re
import requests
from packaging import version
from configparser import ConfigParser

repo_url = "https://raw.githubusercontent.com/Maks1mio/YMusic-DRPC/beta/"
local_path = "YandexDiscordRPC"
version_file = os.path.join(local_path, "version.ini")

files_to_copy = [
    "lib/application_manager.py"
    "lib/discord_rpc_manager.py"
    "lib/logging_config.py"
    "lib/request_handler.py"
    "lib/websocket_manager.py"
    
    "data.json",
    "discordrpc.js",
    "install_dependencies.py",
    "main.py",
    "updater.py",
    "version.ini",
    "yandex_music.log",
]

external_files_to_copy = [
    {"name": "install.cmd", "destination": os.path.join(os.getcwd(), "install.cmd")},
]

def update_repository():
    print("Updating repository...")

    response = requests.get(f"{repo_url}YandexDiscordRPC/version.ini")
    
    if response.status_code == 200:
        os.makedirs(os.path.dirname(version_file), exist_ok=True)

        current_version = version.parse(get_current_version())

        response_digits_match = re.search(r'\d+(\.\d+)*', response.text)
        current_digits_match = re.search(r'\d+(\.\d+)*', str(current_version.public))

        print(f"Last Version: {response_digits_match.group(0)}")
        print(f"Current Install: {current_digits_match.group(0)}")

        if response_digits_match.group(0) != current_digits_match.group(0):
            print("Local version does not match latest version. Updating...")
            print("Copying files...")
            copy_files(files_to_copy)
            copy_external_files(external_files_to_copy)
            with open(version_file, 'w', encoding='utf-8') as local_version_file:
                local_version_file.write(response.text)
            print(f"Update complete {response_digits_match.group(0)}")
        else:
            print("No changes in version, skipping update.")
    else:
        print(f"Failed to retrieve latest version. Status code: {response.status_code}")

def get_current_version():
    config = read_version_file()
    return config.get('Version', 'version', fallback='0.0.0')

def read_version_file():
    config = ConfigParser()
    if os.path.exists(version_file):
        config.read(version_file)
    return config

def copy_files(files_to_copy, destination=local_path):
    for file_path in files_to_copy:
        source_file = f"{repo_url}{local_path}/{file_path}"
        target_file = os.path.join(destination, file_path)

        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        print(f"Copying {source_file} to {target_file}")
        response = requests.get(source_file)

        if response.status_code == 200:
            with open(target_file, 'w', encoding='utf-8') as local_file:
                local_file.write(response.text)
        else:
            print(f"Failed to retrieve {source_file}. Status code: {response.status_code}")

def copy_external_files(files_to_copy):
    for file_info in files_to_copy:
        source_file = f"{repo_url}{file_info['name']}"
        target_file = file_info['destination']

        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        print(f"Copying {source_file} to {target_file}")
        response = requests.get(source_file)

        if response.status_code == 200:
            with open(target_file, 'w', encoding='utf-8') as local_file:
                local_file.write(response.text)
        else:
            print(f"Failed to retrieve {source_file}. Status code: {response.status_code}")

def main():
    update_repository()

if __name__ == "__main__":
    main()
