function logPlayerBarInfo() {
    const playerBarTitleElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_title"]');
    const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_artists"]');
    const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');

    const titleText = playerBarTitleElement ? playerBarTitleElement.textContent.trim() : '';
    const artistText = artistLinkElement ? artistLinkElement.textContent.trim() : '';

    const linkTitle = linkTitleElement ? linkTitleElement.getAttribute('href') : '';
    const albumId = linkTitle ? linkTitle.split('=')[1] : '';

    let timecodesArray = Array.from(timecodeElements, (element) => element.textContent.trim());
                if (timecodesArray.length > 2) {
                    timecodesArray = timecodesArray.slice(0, 2);
                }
    
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
