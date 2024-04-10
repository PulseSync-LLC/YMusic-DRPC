function logPlayerBarInfo() {
    const playerBarTitleElement = document.querySelector('[class*="Meta_albumLink"]');
    const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_artists"]');
    const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');
    const titleText = playerBarTitleElement ? playerBarTitleElement.textContent.trim() : '';

    const artistTextElements = artistLinkElement ? artistLinkElement.querySelectorAll('[class*="Meta_artistCaption"]') : null;
    const artistTexts = artistTextElements ? Array.from(artistTextElements).map(element => element.textContent.trim()) : [];

    const linkTitle = playerBarTitleElement ? playerBarTitleElement.getAttribute('href') : '';
    const albumId = linkTitle ? linkTitle.split('=')[1] : '';

    const timecodesArray = Array.from(timecodeElements, (element) => element.textContent.trim());
    const ImgTrack = imgElements.length > 0 ? Array.from(imgElements, (element) => element.src) : [[None, 'ym']];

    return {
        playerBarTitle: titleText,
        artist: artistTexts.join(', '),
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
