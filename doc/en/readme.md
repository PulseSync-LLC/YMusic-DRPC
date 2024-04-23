[[ > English < ]](https://github.com/PulseSync-Official/YMusic-DRPC/blob/patcher/doc/en/readme.md) - [[ Русский ]](https://github.com/PulseSync-Official/YMusic-DRPC/tree/patcher)
![image](https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/ee18b157-914d-495c-a4a0-7569ad0a2872)

<p align="center">
   <a href="https://discord.gg/qy42uGTzRy">
      <img width="250" alt="YMusic-DRPC invite" src="https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/e4604edc-4bea-4bcc-80e4-49d3ec6bce33">
   </a>
</p>
<p align="center">
   <a href="https://boosty.to/evt">
      <img width="285" alt="Donate Boosty" src="https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/a1461d7d-a8bd-4fbb-9c17-b2254007b3e4">
   </a>
</p>

**YandexMusic Discord Rich Presence Integration - Documentation**

*Note: The following instructions assume that YandexMusic BETA 5.0.19+ is installed in the default directory ("AppData\Local\Programs\YandexMusic"). Ensure YandexMusic is closed*

**Screenshots**

![image](https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/433a2d4e-6836-438e-8100-151bf405546f)

<p align="center">
     <img width="45%" alt="1" src="https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/cea9c24e-8249-4f84-8c8b-f7120475e3bb">
     <img width="45%" alt="2" src="https://github.com/PulseSync-Official/YMusic-DRPC/assets/44835662/f576e409-3378-4bf0-b153-b01a6d5c13c3">
</p>

### Installation Steps:

1. **Download YandexMusic:**
   - Download YandexMusic BETA 5.0.19+ from [Yandex Music](https://music.yandex.ru/download/?utm_source=music&utm_medium=selfpromo_music&utm_term=branding&utm_campaign=app).
   - Install YandexMusic to the standard directory: `C:\Users\<YourName>\AppData\Local\Programs\YandexMusic`.

2. **Install git:**
   - Download git using this link [ссылке](https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe ) (the download will start automatically).

3. **Download Application Files:**
   - Download project files or clone the project using the console:
    ```bash
    git clone https://github.com/PulseSync-Official/YMusic-DRPC.git
    ```
   - Clone into the Programs directory: `C:\Users\<YourName>\AppData\Local\Programs`.

    ### Directory Structure:
    ```markdown
    | Local\Programs        | Files              |
    |-----------------------|--------------------|
    | YMusic-DRPC/          |                    |
    | |-- YandexDiscordRPC/ |                    |
    | |   |-- index.js      |                    |
    | |   |-- other files.. |                    |
    | YandexMusic/          |                    |
    | |-- Яндекс Музыка.exe |                    |
    | |-- other files...    |                    |
    ```  
4. **Install Node.Js:**
   - Download and install Node.Js by following the [link](https://nodejs.org/dist/v21.7.3/node-v21.7.3-x64.msi) (the download will start automatically).

**Perform further actions in the project directory: `C:\Users \<Your Name>\AppData\Local\Programs\YMusic-DRPC`**

5. **Install Yarn and Electron:**
   - Install Yarn, Electron and @electron-forge/cli using the console:
    ```bash
    npm install --global yarn
    npm i -g electron
     
    ```
   - Verify Yarn and Electron installations by running:
    ```bash
    yarn --version
    electron --version
     
    ```
6. **Install Dependencies:**
   - Install the dependencies in the project directory `C:\Users\<YourName>\AppData\Local\Programs\YMusic-DRPC` using the console:
    ```bash
    yarn global add @electron-forge/cli
    yarn install
     
    ```
   6.1 **Error There appears to be trouble with your network connection.**
      - In case of error `info There appears to be trouble with your network connection. Retrying...` it is recommended to restart the computer. Then repeat `yarn install` in the project directory.
      - If the reboot did not help, Yarn may be trying to install packages via Proxy, which are undefined by default in it, in which case just delete them by entering the following commands into the console:
      ```bash
       yarn config delete https-proxy
       yarn config delete proxy
       
      ```
  
7. **Run the Application:**
    - Run the application using the console:
     ```bash
     yarn start
     ```
    - Click the `Patch` button to install the script into Yandex Music.
8. **Errors and other problems:**
    - Errors and problems during installation or operation of the application can always occur. You can create an `issue` with a description of your problem or write about the problem on the discord silver [YandexMusic DRPC](https://discord.gg/qy42uGTzRy ) where they will try to help you.



