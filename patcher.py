import os

def find_rum_script(start_dir):
    for root, dirs, files in os.walk(start_dir):
        if "rumScript.js" in files:
            rum_script_path = os.path.join(root, "rumScript.js")
            with open(rum_script_path, "r") as file:
                rum_script_content = file.read()
                if "function logPlayerBarInfo()" in rum_script_content:
                    print("Файл rumScript.js содержит функцию logPlayerBarInfo().")
                    print(rum_script_content)
                else:
                    print("Файл rumScript.js не содержит функцию logPlayerBarInfo().")
                    # Вставить код в конец файла, если функция отсутствует
                    with open(rum_script_path, "a") as file_append:
                        file_append.write("""
function logPlayerBarInfo() {
    const playerBarTitleElement = document.querySelector('[class*="PlayerBarTitle_titleLink"]');
    const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_artistLink"]');
    const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');

    const titleText = playerBarTitleElement ? playerBarTitleElement.textContent.trim() : '';
    const artistText = artistLinkElement ? artistLinkElement.textContent.trim() : '';

    const linkTitle = playerBarTitleElement ? playerBarTitleElement.getAttribute('href') : '';
    const albumId = linkTitle ? linkTitle.split('=')[1] : '';

    const timecodesArray = Array.from(timecodeElements, (element) => element.textContent.trim());
    const ImgTrack = imgElements.length > 0 ? Array.from(imgElements, (element) => element.src) : [[None, 'ym']];

    return {
        playerBarTitle: titleText,
        artist: artistText,
        timecodes: timecodesArray,
        requestImgTrack: ImgTrack,
        linkTitle: albumId
    };
}

setInterval(() => {
    const result = logPlayerBarInfo();

    fetch('http://127.0.0.1:19582/update_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    });
}, 1000);
""")
    print("Содержимое файла успешно обновлено.")
    return

    print("Файл rumScript.js не найден.")

def extract_app_asar():
    destination_dir = os.path.join(os.environ["LOCALAPPDATA"], "Programs", "YDRPC Patcher", "app")
    find_rum_script(destination_dir)

extract_app_asar()
