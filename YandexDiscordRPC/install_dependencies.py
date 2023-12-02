import subprocess

dependencies = ["websockets", "pywinauto", "pypresence", "requests", "psutil"]

for package in dependencies:
    try:
        subprocess.run(["pip", "install", package], check=True)
        print(f"Successfully installed {package}.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install {package}. Error: {e}")
