function extractTrackId(url) {
    const match = url.match(/track-id=(\d+)/);
    return match ? match[1] : null;
}

function logPlayerBarInfo() {
    let titleText = '';
    let artistText = '';
    let ImgTrack = [];
    let timecodesArray = [];
    let RequestUrl = [];

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

    const matchingRequests = allRequests.filter(request => request.name.includes('?track-id='));

    if (matchingRequests.length > 0) {
        const lastMatchingRequest = matchingRequests.pop();
        RequestUrl.push({
            url: lastMatchingRequest.name,
            idTrack: extractTrackId(lastMatchingRequest.name)
        });
    } else {
        RequestUrl.push({
            url: "https://ya.ru",
            idTrack: "https://ya.ru"
        });
    }


    return {
        playerBarTitle: titleText,
        artist: artistText,
        timecodes: timecodesArray,
        lastRequestUrl: RequestUrl,
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
