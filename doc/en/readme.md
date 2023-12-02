[[ > English < ]](https://github.com/Maks1mio/YMusic-DRPC/blob/main/doc/en/readme.md) - [[ Русский ]](https://github.com/Maks1mio/YMusic-DRPC)

**YandexMusic Discord Rich Presence Integration - Documentation**

*Note: The following instructions assume that YandexMusic BETA 5.0.3 is installed in the default directory ("AppData\Local\Programs\YandexMusic"). Ensure YandexMusic is closed before proceeding.*

### Installation Steps:

1. **Download YandexMusic:**
   - Download YandexMusic BETA 5.0.3 from [Yandex Music](https://music.yandex.ru/download/?utm_source=music&utm_medium=selfpromo_music&utm_term=branding&utm_campaign=app).
   - Install YandexMusic in the default directory: `C:\Users\<YourUsername>\AppData\Local\Programs\YandexMusic`.

2. **Download Discord Rich Presence Script:**
   - Download the project files or clone the project using the console:
    ```bash
    git clone https://github.com/Maks1mio/YMusic-DRPC.git
    ```
   - Extract the contents to the YandexMusic directory: `C:\Users\<YourUsername>\AppData\Local\Programs\YandexMusic`.

3. **Install Dependencies:**
   - Open a Command Prompt in the YandexMusic directory.
   - Double-click on `install.cmd` to install all modules.

4. **Run the Script:**
   - Double-click on `start.cmd` to launch the Discord Rich Presence script.

### Usage:

- The script automatically detects whether to use `py` or `python` based on your system. If one fails, it tries the other.

- The script launches a server on port 19582 and updates your Discord Rich Presence with information from YandexMusic.

### Troubleshooting:

- **Script Errors:**
  - If you encounter errors, check the console window for details.
  - Ensure YandexMusic is closed before running the script.

- **YandexMusic Version:**
  - This script was developed for YandexMusic BETA 5.0.3.

- **Dependencies:**
  - If you face issues with dependencies, ensure your Python installation is in the system PATH.

- **Websocket URL not found:**
  - If the WebSocket URL is not found, check if YandexMusic is running and has the remote debugging option enabled.

### Additional Information:

- The script creates a log file (`yandex_music.log`) in the YandexMusic directory for debugging purposes.
**AT THE MOMENT, THIS FILE HAS NO SIGNIFICANCE**

- Buttons in Discord Rich Presence allow you to open the current track in the browser.

- Make sure to follow any updates or changes to the script on the [GitHub repository](<GitHub_Repository_URL>).

**Disclaimer:**
This integration was developed solely for educational purposes. Compatibility with future versions of YandexMusic is not guaranteed. **Usage of this script for violating YandexMusic's rules may result in a ban on your account.**
