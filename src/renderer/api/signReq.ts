import * as crypto from 'crypto'

function getSign(trackId: number, timeStamp: number) {
    // короче раскопали android приложение и принесли КАРТУ с раскопок (это ключ если что, яндекс контора п****)
    // const id = `${trackId}:${albumId}`
    const payload = `${trackId}${timeStamp}`
    const hmac = crypto.createHmac('sha256', 'p93jhgh689SBReK6ghtw62')

    hmac.update(payload)

    return `${hmac.digest('base64')}`
}

export default getSign
