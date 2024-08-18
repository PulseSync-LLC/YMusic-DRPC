import Layout from '../../components/layout'
import Container from '../../components/container'

import * as styles from '../../../../static/styles/page/index.module.scss'
import * as inputStyle from '../../../../static/styles/page/textInputContainer.module.scss'
import * as theme from './bugreport.module.scss'
import { MdAdd, MdChevronLeft, MdChevronRight, MdClose, MdColorLens, MdDeleteForever, MdOpenInBrowser } from 'react-icons/md'
import { useEffect, useRef, useState } from 'react'
import { useCharCount } from '../../utils/useCharCount';

export default function BugReportPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);
    const [showHotKeyInfo, setShowHotKeyInfo] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const images = [
        "https://media.discordapp.net/attachments/981230670615560292/1088828798755143750/ezgif.com-gif-maker_6.gif?ex=66c20257&is=66c0b0d7&hm=875147536d17a1716b199410eedd5756b01f931a4078eb459cebc15778cd9b93&=&width=287&height=282",
        "https://media.discordapp.net/attachments/482180995752394752/1071208563210453042/image.png?ex=66c1d8f7&is=66c08777&hm=caeb2de506385cd9368d0049dfea9345a2d5ce81f242c710e0665e03f548f028&=&format=webp&quality=lossless&width=960&height=372"
    ];

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
        setScale(1);
        setPosition({ x: 0, y: 0 });
        showHotKey();
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const handleNext = () => {
        const currentIndex = images.indexOf(selectedImage!);
        const nextIndex = (currentIndex + 1) % images.length;
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setSelectedImage(images[nextIndex]);
    };

    const handlePrev = () => {
        const currentIndex = images.indexOf(selectedImage!);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setSelectedImage(images[prevIndex]);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            const newScale = Math.max(0.5, Math.min(5, scale + e.deltaY * -0.01));
            setScale(newScale);
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) {
            setMouseDown(true);
            setDragging(true);
            setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragging && mouseDown) {
            const newX = e.clientX - startDrag.x;
            const newY = e.clientY - startDrag.y;

            if (imageRef.current) {
                const container = imageRef.current.parentElement!;
                const imageRect = imageRef.current.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
                const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);

                setPosition({
                    x: Math.max(-maxX, Math.min(maxX, newX)),
                    y: Math.max(-maxY, Math.min(maxY, newY))
                });
            }
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setMouseDown(false);
    };

    const showHotKey = () => {
        setShowHotKeyInfo(true);
        setTimeout(() => {
            setShowHotKeyInfo(false);
        }, 6000);
    };

    useEffect(() => {
        const handleWheelEvent = (e: WheelEvent) => {
            if (e.ctrlKey) {
                const newScale = Math.max(0.5, Math.min(5, scale + e.deltaY * -0.01));
                setScale(newScale);
            }
        };

        window.addEventListener('wheel', handleWheelEvent, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheelEvent);
        };
    }, [scale]);

    const containerRef = useRef<HTMLDivElement>(null);
    const fixedTheme = { charCount: inputStyle.charCount };
    useCharCount(containerRef, fixedTheme);
    return (
        <Layout title="Bug Report">
            <div className={styles.page}>
                <div className={styles.container}>
                    <div ref={containerRef} className={styles.main_container}>
                        <Container
                            titleName={'Bug Report'}
                            description={'Опишите свою проблему чтоб мы могли решить проблему.'}
                            imageName={'bugReport'}
                        ></Container>
                        <div className={styles.container30x15}>
                            <div className={theme.container}>
                                <div className={theme.switchProblem}>
                                    <button className={`${theme.switchButton} ${theme.switchButtonActive}`}><MdOpenInBrowser size={24} /> Проблема приложения</button>
                                    <button className={`${theme.switchButton}`}><MdColorLens size={24} /> Проблема UI/UX</button>
                                </div>
                                {/* Меняемый контент отсюда */}
                                {/* первая форма */}
                                <div
                                    className={theme.optionalContainer}
                                >
                                    <div
                                        className={
                                            inputStyle.textInputContainer
                                        }
                                    >
                                        <div>Заголовок</div>
                                        <input
                                            maxLength={124}
                                            type="text"
                                            placeholder="заголовок"
                                            className={
                                                inputStyle.styledInput
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            inputStyle.textInputContainer
                                        }
                                    >
                                        <div>Описание проблемы</div>
                                        <textarea
                                            style={{ height: "130px" }}
                                            placeholder="описание"
                                            className={
                                                inputStyle.styledInput
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            inputStyle.textInputContainer
                                        }
                                    >
                                        <div>Шаги воспроизведения проблемы</div>
                                        <textarea
                                            style={{ height: "170px" }}
                                            placeholder="опишите шаги"
                                            className={
                                                inputStyle.styledInput
                                            }
                                        />
                                    </div>
                                    <div className={theme.rightPos}>
                                        <button className={theme.sendButton}>Отправить</button>
                                    </div>
                                </div>
                                {/* вторая форма */}
                                <div
                                    className={theme.optionalContainer}
                                >
                                    <div
                                        className={
                                            inputStyle.textInputContainer
                                        }
                                    >
                                        <div>Заголовок</div>
                                        <input
                                            type="text"
                                            placeholder="заголовок"
                                            className={
                                                inputStyle.styledInput
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            inputStyle.textInputContainer
                                        }
                                    >
                                        <div>Описание проблемы</div>
                                        <textarea
                                            style={{ height: "130px" }}
                                            placeholder="описание"
                                            className={
                                                inputStyle.styledInput
                                            }
                                        />
                                    </div>
                                    <div className={inputStyle.textInputContainer}>
                                        <div>Скриншоты</div>
                                        <div className={inputStyle.styledInput}>
                                            {images.map((src, index) => (
                                                <div key={index} className={inputStyle.uploadedImage}>
                                                    <img
                                                        src={src}
                                                        alt={`Uploaded ${index + 1}`}
                                                        onClick={() => handleImageClick(src)}
                                                    />
                                                    <button><MdDeleteForever size={18} /></button>
                                                </div>
                                            ))}
                                            <button className={inputStyle.uploadButton}><MdAdd size={34} /></button>
                                        </div>
                                    </div>
                                    <div className={theme.rightPos}>
                                        <button className={theme.sendButton}>Отправить</button>
                                    </div>
                                </div>
                                {/*  */}
                                {selectedImage && (
                                    <div
                                        className={theme.fullScreenOverlay}
                                        onWheel={handleWheel}
                                        onMouseMove={handleMouseMove}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                    >
                                        <div className={theme.fullScreenImageContainer}>
                                            <img
                                                src={selectedImage}
                                                alt="Full screen"
                                                ref={imageRef}
                                                className={theme.fullScreenImage}
                                                style={{
                                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                                    cursor: dragging ? 'grabbing' : 'default'
                                                }}
                                                onMouseDown={handleMouseDown}
                                            />
                                            <div className={theme.countSelect}>
                                                {`Картинка ${images.indexOf(selectedImage!) + 1}/${images.length}`}
                                            </div>
                                            <button className={theme.closeButton} onClick={handleClose}>
                                                <MdClose size={24} />
                                            </button>
                                            {showHotKeyInfo && (
                                                <div className={theme.hotKey}>
                                                    <div className={theme.hotKeyInfo}><div className={theme.hotKeyMainInfo}>Scale</div>/<div>CTRL + MOUSE 3</div></div>
                                                    <div className={theme.hotKeyInfo}><div className={theme.hotKeyMainInfo}>dragging</div>/<div>MOUSE 3</div></div>
                                                </div>
                                            )}
                                            <button className={theme.prevButton} onClick={handlePrev}><MdChevronLeft size={24} /></button>
                                            <button className={theme.nextButton} onClick={handleNext}><MdChevronRight size={24} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}