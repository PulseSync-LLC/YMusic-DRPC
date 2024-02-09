import logging
import sys

logger = logging.getLogger()
logging.basicConfig(
    filename='YandexDiscordRPC/yandex_music.log',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    encoding='utf-8'
)

console_handler = logging.StreamHandler(sys.stdout)
file_handler = logging.FileHandler('YandexDiscordRPC/yandex_music.log')

console_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.addHandler(console_handler)
logger.addHandler(file_handler)
