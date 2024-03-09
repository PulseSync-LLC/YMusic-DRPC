import os
import re
import webbrowser
import requests
from packaging import version
from configparser import ConfigParser
import tkinter as tk
from tkinter import ttk
from threading import Thread

# repo_url = "https://raw.githubusercontent.com/Maks1mio/YMusic-DRPC/beta/" * beta 
repo_url = "https://raw.githubusercontent.com/Maks1mio/YMusic-DRPC/main/"
local_path = "YandexDiscordRPC"
version_file = os.path.join(local_path, "version.ini")

files_to_copy = [
    "lib/application_manager.py",
    "lib/discord_rpc_manager.py",
    "lib/logging_config.py",
    "lib/request_handler.py",
    "lib/websocket_manager.py",
    "data.json",
    "discordrpc.js",
    "main.py",
    "obs.html",
    "updater.py",
    "version.ini",
    "yandex_music.log",
]

external_files_to_copy = [
    {"name": "install.cmd", "destination": os.path.join(os.getcwd(), "install.cmd")},
    {"name": "start.cmd", "destination": os.path.join(os.getcwd(), "start.cmd")},
]

fonts_to_download = [
    {"name": "Sansation-Bold.ttf", "destination": os.path.join(local_path, "assets/font/Sansation-Bold.ttf")},
    {"name": "Sansation-Regular.ttf", "destination": os.path.join(local_path, "assets/font/Sansation-Regular.ttf")},
]

icons_to_download = [
    {"name": "icon.png", "destination": os.path.join(local_path, "assets/icon.png")},
    {"name": "iconUpdater.png", "destination": os.path.join(local_path, "assets/iconUpdater.png")},
]

def center_window(window):
    window.update_idletasks()
    width = window.winfo_width()
    height = window.winfo_height()
    x_offset = (window.winfo_screenwidth() - width) // 2
    y_offset = (window.winfo_screenheight() - height) // 2
    window.geometry(f"+{x_offset}+{y_offset}")

def update_repository():
    root = tk.Tk()
    root.title("Updating YMusic-DRPC")
    root.geometry("400x400") 
    root.iconphoto(True, tk.PhotoImage(file="YandexDiscordRPC/assets/iconUpdater.png"))
    root.overrideredirect(True)
    
    root.configure(bg="#0F0F0F")

    content_frame = tk.Frame(root, bg="#0F0F0F")
    content_frame.pack(expand=True)

    logo_img = tk.PhotoImage(file="YandexDiscordRPC/assets/iconUpdater.png")
    logo_label = tk.Label(content_frame, image=logo_img, bg="#0F0F0F")
    logo_label.pack(pady=10)

    custom_font = ("Sansation-Bold", 12)
    label = tk.Label(content_frame, text="Updating repository...", fg="white", bg="#0F0F0F", font=custom_font)  # Устанавливаем цвет текста
    label.pack()

    progress = ttk.Progressbar(content_frame, orient="horizontal", length=300, mode="determinate", style="black.Horizontal.TProgressbar")  # Стилизуем прогрессбар
    progress.pack(pady=10)
    
    github_button = tk.Button(content_frame, text="Open GitHub", command=lambda: webbrowser.open("https://github.com/Maks1mio/YMusic-DRPC"), fg="#58a6ff", cursor="hand2", bd=0, bg="#0F0F0F", activebackground="#0F0F0F", relief="flat", underline=True)
    github_button.pack(pady=10)

    center_window(root)

    def update():
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
                progress["maximum"] = len(files_to_copy) + len(external_files_to_copy) + len(fonts_to_download) + len(icons_to_download)
                progress["value"] = 0

                label.config(text="Copying files...")

                root.update()

                copy_files(files_to_copy)
                progress.step(len(files_to_copy))

                copy_external_files(external_files_to_copy)
                progress.step(len(external_files_to_copy))

                download_fonts(fonts_to_download)
                progress.step(len(fonts_to_download))

                download_icons(icons_to_download)
                progress.step(len(icons_to_download))

                with open(version_file, 'w', encoding='utf-8') as local_version_file:
                    local_version_file.write(response.text)
                label.config(text=f"Update complete {response_digits_match.group(0)}")
                root.after(3000, root.destroy)
            else:
                label.config(text="No changes in version, skipping update.")
                root.after(3000, root.destroy)
        else:
            label.config(f"Failed to retrieve latest version. Status code: {response.status_code}")
            root.after(3000, root.destroy)

    thread = Thread(target=update)
    thread.start()

    root.mainloop()

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

def download_fonts(fonts_to_download):
    for font_info in fonts_to_download:
        source_file = f"{repo_url}YandexDiscordRPC/assets/font/{font_info['name']}"
        target_file = font_info['destination']

        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        print(f"Downloading {source_file} to {target_file}")

        response = requests.get(source_file)

        if response.status_code == 200:
            with open(target_file, 'wb') as local_file:
                local_file.write(response.content)
        else:
            print(f"Failed to retrieve {source_file}. Status code: {response.status_code}")

def download_icons(icons_to_download):
    for icon_info in icons_to_download:
        source_file = f"{repo_url}YandexDiscordRPC/assets/{icon_info['name']}"
        target_file = icon_info['destination']

        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        print(f"Downloading {source_file} to {target_file}")

        response = requests.get(source_file)

        if response.status_code == 200:
            with open(target_file, 'wb') as local_file:
                local_file.write(response.content)
        else:
            print(f"Failed to retrieve {source_file}. Status code: {response.status_code}")

def main():
    update_repository()

if __name__ == "__main__":
    main()
