[[ > English < ]](https://github.com/Maks1mio/YMusic-DRPC/blob/main/doc/en/readme.md) - [[ Русский ]](https://github.com/Maks1mio/YMusic-DRPC)

**YandexMusic Discord Rich Presence Integration - Documentation**

*Note: The following instructions assume that YandexMusic BETA 5.0.14 is installed in the default directory ("AppData\Local\Programs\YandexMusic"). Ensure YandexMusic is closed before proceeding.*

**Screenshots**

![image](https://github.com/Maks1mio/YMusic-DRPC/assets/44835662/c8af3316-db14-4fdd-85dc-23fc6e8d9406)

![image](https://github.com/Maks1mio/YMusic-DRPC/assets/44835662/8cb9421e-feac-454c-abad-6ce6e0b769fe)
![image](https://github.com/Maks1mio/YMusic-DRPC/assets/44835662/20965613-eb89-41cf-99dc-6430b93d38e8)

### Installation Steps:

1. **Download YandexMusic:**
   - Download YandexMusic BETA 5.0.14 from [Yandex Music](https://music.yandex.ru/download/?utm_source=music&utm_medium=selfpromo_music&utm_term=branding&utm_campaign=app).
   - Install YandexMusic in the standard directory: `C:\Users\<YourUsername>\AppData\Local\Programs\YandexMusic`.

2. **Download Script Files:**
   - Download the project files or clone the project using the console:
     ```bash
     git clone https://github.com/Maks1mio/YMusic-DRPC.git
     ```
   - Clone it into the Programs directory: `C:\Users\<YourUsername>\AppData\Local\Programs`.

    ### Directory Structure:
    ```markdown
    | Local\Programs        | Files              |
    |-----------------------|--------------------|
    | YMusic-DRPC/          |                    |
    | |-- YandexDiscordRPC/ |                    |
    | |   |-- main.py       |                    |
    | |   |-- other files...|                    |
    | YandexMusic/          |                    |
    | |-- Яндекс Музыка.exe |                    |
    | |-- other files...    |                    |
    ```  

3. **Install Dependencies:**
   - Double click on `install.cmd` to install all modules.

4. **Run the Script:**
   - Double click on `YDRPC.exe` to run the Discord Rich Presence script.

### Usage:

- The script automatically determines whether to use `py` ~~or `python`~~ depending on your system. If one doesn't work, it tries the other.

- The script starts a server on port 19582 and updates information about Yandex Music in your Discord Rich Presence.

### Troubleshooting:

- **Script Errors:**
  - If errors occur, check the console window for details.
  - Ensure Yandex Music is closed before running the script.

- **YandexMusic Version:**
  - This script is designed for Yandex Music BETA 5.0.14.

- **Dependencies:**
  - If there are issues with dependencies, ensure your Python installation is in the system PATH.

- **WebSocket URL Not Found:**
  - If the WebSocket URL is not found, check if Yandex Music is running and if remote debugging is enabled.

### Additional Information:

- The script creates a log file (`yandex_music.log`) in the Yandex Music directory for debugging. **Currently not meaningful.**

- Buttons in Discord Rich Presence allow you to open the current track in the browser.

- Keep an eye on updates or changes to the script on the [GitHub repository](https://github.com/Maks1mio/YMusic-DRPC).

**Disclaimer:**
This integration was developed solely for educational purposes. Compatibility with future versions of Yandex Music is not guaranteed. **Using this script to violate YandexMusic's rules may result in a ban on your account.**
