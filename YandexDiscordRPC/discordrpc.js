function extractTrackId(url) {
    const match = url.match(/tracks\/(\d+)/);
    return match ? match[1] : null;
}


function logPlayerBarInfo() {
    let titleText = '';
    let artistText = '';
    let ImgTrack = [];
    let timecodesArray = [];
    let LastTrack = [];

    const playerBarTitleElement = document.querySelector('[class*="PlayerBarDesktop_titleLink"]');
    const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_artistLink"]');
    const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
    const imgElement  = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');

    if (playerBarTitleElement) {
        titleText = playerBarTitleElement.textContent.trim();
    }

    if (artistLinkElement) {
        artistText = artistLinkElement.textContent.trim();
    }

    if (timecodeElements.length > 0) {
        timecodeElements.forEach((element) => {
            const timecodeText = element.textContent.trim();
            timecodesArray.push(timecodeText);
        });
    }

    if (imgElement.length > 0) {
        imgElement.forEach((element) => {
            const imageURL = element.src;
            ImgTrack.push(imageURL);
        });
    } else {
        ImgTrack.push([None, 'ym']);
    }

    const allRequests = performance.getEntriesByType('resource');
    const matchingRequests = allRequests.filter(request => request.name.includes('https://api.music.yandex.net/tracks/'));

    if (matchingRequests.length > 0) {
        const lastMatchingRequest = matchingRequests.pop();
        const idTrack = extractTrackId(lastMatchingRequest.name);
        LastTrack.push({
            idTrack: idTrack
        });
    } else {
        LastTrack.push({
            idTrack: "https://ya.ru"
        });
    }
    return {
        playerBarTitle: titleText,
        artist: artistText,
        timecodes: timecodesArray,
        LastTrackId: LastTrack,
        requestImgTrack: ImgTrack
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
