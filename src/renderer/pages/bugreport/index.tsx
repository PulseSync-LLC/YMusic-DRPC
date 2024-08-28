import Layout from '../../components/layout'
import Container from '../../components/container'
import * as Sentry from '@sentry/electron/renderer'
import { promises as fsPromises } from '@zenfs/core'
import FormData from 'form-data'
import * as styles from '../../../../static/styles/page/index.module.scss'
import * as inputStyle from '../../../../static/styles/page/textInputContainer.module.scss'
import * as theme from './bugreport.module.scss'
import {
    MdAdd,
    MdChevronLeft,
    MdChevronRight,
    MdClose,
    MdColorLens,
    MdDeleteForever,
    MdOpenInBrowser,
} from 'react-icons/md'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCharCount } from '../../utils/useCharCount'
import { object, string } from 'yup'
import { useFormik } from 'formik'
import toast from '../../api/toast'
import apolloClient from '../../api/apolloClient'
import { CREATE_BUG_REPORT } from '../../api/queries/user/bugreport.mutation'
import config from '../../api/config'
import getUserToken from '../../api/getUserToken'
import http from '../../api/http'
import userContext from '../../api/context/user.context'
import axios from 'axios'
import path from 'path'
import { useNavigate } from 'react-router-dom'

export default function BugReportPage() {
    const navigate = useNavigate()
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null,
    )
    const { user } = useContext(userContext)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 })
    const [mouseDown, setMouseDown] = useState(false)
    const [showHotKeyInfo, setShowHotKeyInfo] = useState(false)
    const [activeForm, setActiveForm] = useState(1)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index)
        setScale(1)
        setPosition({ x: 0, y: 0 })
        showHotKey()
    }

    const handleClose = () => {
        setSelectedImageIndex(null)
    }

    const handleNext = () => {
        if (selectedImageIndex !== null && values.images.length > 0) {
            const nextIndex = (selectedImageIndex + 1) % values.images.length
            setScale(1)
            setPosition({ x: 0, y: 0 })
            setSelectedImageIndex(nextIndex)
        }
    }
    const handlePrev = () => {
        if (selectedImageIndex !== null && values.images.length > 0) {
            const prevIndex =
                (selectedImageIndex - 1 + values.images.length) %
                values.images.length
            setScale(1)
            setPosition({ x: 0, y: 0 })
            setSelectedImageIndex(prevIndex)
        }
    }

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            const newScale = Math.max(
                0.5,
                Math.min(5, scale + e.deltaY * -0.01),
            )
            setScale(newScale)
            setPosition({ x: 0, y: 0 })
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) {
            setMouseDown(true)
            setDragging(true)
            setStartDrag({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragging && mouseDown) {
            const newX = e.clientX - startDrag.x
            const newY = e.clientY - startDrag.y

            if (imageRef.current) {
                const container = imageRef.current.parentElement!
                const imageRect = imageRef.current.getBoundingClientRect()
                const containerRect = container.getBoundingClientRect()

                const maxX = Math.max(
                    0,
                    (imageRect.width - containerRect.width) / 2,
                )
                const maxY = Math.max(
                    0,
                    (imageRect.height - containerRect.height) / 2,
                )

                setPosition({
                    x: Math.max(-maxX, Math.min(maxX, newX)),
                    y: Math.max(-maxY, Math.min(maxY, newY)),
                })
            }
        }
    }

    const handleMouseUp = () => {
        setDragging(false)
        setMouseDown(false)
    }
    const handleDeleteImage = (index: number) => {
        setValues({
            ...values,
            images: values.images.filter((_, i) => i !== index),
        })
        console.log(values.images.filter((_, i) => i !== index))
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null)
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxAllowedSize = 15 * 1024 * 1024
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        if (
            e.target.files[0] &&
            e.target.files.length > 0 &&
            e.target.files[0].size <= maxAllowedSize
        ) {
            const file = e.target.files[0]
            try {
                const buffer = await file.arrayBuffer()
                const updatedImages = [
                    ...values.images,
                    {
                        file,
                        buffer: Buffer.from(buffer),
                    },
                ]
                await setValues({
                    ...values,
                    images: updatedImages,
                })
            } catch (error) {
                console.error('Ошибка при обработке файла: ', error)
            }
        } else {
            toast.error('Файл должен быть не больше 15МБ')
            return
        }
    }

    const handleAddImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }
    const showHotKey = () => {
        setShowHotKeyInfo(true)
        setTimeout(() => {
            setShowHotKeyInfo(false)
        }, 6000)
    }

    useEffect(() => {
        const handleWheelEvent = (e: WheelEvent) => {
            if (e.ctrlKey) {
                const newScale = Math.max(
                    0.5,
                    Math.min(5, scale + e.deltaY * -0.01),
                )
                setScale(newScale)
            }
        }

        window.addEventListener('wheel', handleWheelEvent, { passive: false })

        return () => {
            window.removeEventListener('wheel', handleWheelEvent)
        }
    }, [scale])

    const containerRef = useRef<HTMLDivElement>(null)
    const fixedTheme = { charCount: inputStyle.charCount }
    useCharCount(containerRef, fixedTheme)
    const sendLogs = async (res: any) => {
        try {
            let archivePath: string =
                await window.desktopEvents?.invoke('getLogArchive')
            console.log('Путь к архиву1212:', archivePath)
            archivePath = path.normalize(archivePath)

            if (archivePath.startsWith('\\') || archivePath.startsWith('/')) {
                archivePath = archivePath.substring(1)
            }
            const fileUrl = `file:///${archivePath}`
            const response = await fetch(fileUrl)

            if (!response.ok) {
                throw new Error(
                    `Ошибка при загрузке файла: ${response.statusText}`,
                )
            }

            const blob = await response.blob()
            const formData = new FormData()
            formData.append('file', blob, 'logs.zip')

            try {
                const response = await axios.post(
                    `${config.SERVER_URL}/user/${user.id}/bugreport/${res.data.createBugReport.uuid}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer: ${getUserToken()}`,
                            ...formData.getHeaders,
                        },
                    },
                )

                if (response.status !== 200) {
                    toast.error(`Ошибка при отправке: ${response.statusText}`)
                } else {
                    console.log('Файл логов успешно отправлен:', response.data)
                    toast.success('Баг-репорт успешно отправлен')
                }
            } catch (uploadError) {
                console.error(
                    'Ошибка при отправке архива с логами:',
                    uploadError.message,
                )
            }
        } catch (error) {
            console.error('Ошибка при отправке архива с логами:', error.message)
        }
    }
    const schema = object().shape({
        title: string()
            .test(
                'len',
                'Минимальная длина 6 символов',
                val => !val || val.length >= 6,
            )
            .test(
                'len',
                'Максимальная длина 64 символов',
                val => !val || val.length <= 64,
            )
            .when([], {
                is: () => activeForm === 1 || activeForm === 2,
                then: schema => schema.required('Обязательное поле'),
                otherwise: schema => schema,
            }),
        description: string()
            .test(
                'len',
                'Минимальная длина 10 символов',
                val => !val || val.length >= 10,
            )
            .test(
                'len',
                'Максимальная длина 1024 символов',
                val => !val || val.length <= 1024,
            )
            .when([], {
                is: () => activeForm === 1 || activeForm === 2,
                then: schema => schema.required('Обязательное поле'),
                otherwise: schema => schema,
            }),
        steps: string()
            .test(
                'len',
                'Минимальная длина 10 символов',
                val => !val || val.length >= 10,
            )
            .test(
                'len',
                'Максимальная длина 1024 символов',
                val => !val || val.length <= 1024,
            )
            .when([], {
                is: () => activeForm === 1,
                then: schema => schema.required('Обязательное поле'),
                otherwise: schema => schema,
            }),
    })
    const {
        errors,
        setValues,
        values,
        touched,
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
    } = useFormik({
        initialValues: {
            title: '',
            description: '',
            steps: '',
            images: [],
        },
        validationSchema: schema,
        onSubmit: async values => {
            try {
                console.log(values)
                try {
                    await apolloClient
                        .mutate({
                            mutation: CREATE_BUG_REPORT,
                            variables: {
                                title: values.title,
                                description: values.description,
                                steps: values.steps,
                            },
                        })
                        .then(async res => {
                            if (res.data.createBugReport) {
                                if (values.images.length > 0) {
                                    const promises = values.images.map(
                                        (_file: any) => {
                                            const formData = new FormData()

                                            formData.append('file', _file.file)

                                            return fetch(
                                                `${config.SERVER_URL}/cdn/upload/bugreport/${res.data.createBugReport.uuid}/image`,
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: `Bearer ${getUserToken()}`,
                                                    },
                                                    body: formData as any,
                                                },
                                            )
                                        },
                                    )

                                    await Promise.all(promises).then(
                                        async (_all: Response[]) => {
                                            let success = true

                                            for (const _response of _all) {
                                                const body =
                                                    await _response.json()

                                                if (!body.ok) {
                                                    toast.error(
                                                        'Произошла ошибка!',
                                                    )
                                                    success = false
                                                }
                                            }

                                            if (success) {
                                                toast.success(
                                                    'Баг-репорт успешно отправлен',
                                                )
                                                await setValues({
                                                    title: '',
                                                    description: '',
                                                    steps: '',
                                                    images: [],
                                                })
                                                setTimeout(() => {
                                                    sendLogs(res)
                                                }, 1500)
                                                navigate('/trackinfo', {
                                                    replace: true,
                                                })
                                            } else {
                                                toast.error(
                                                    'Ошибка при загрузке images',
                                                )
                                            }
                                        },
                                    )
                                } else {
                                    toast.success(
                                        'Баг-репорт успешно отправлен',
                                    )
                                    await setValues({
                                        title: '',
                                        description: '',
                                        steps: '',
                                        images: [],
                                    })
                                    setTimeout(() => {
                                        sendLogs(res)
                                    }, 1500)
                                    navigate('/trackinfo', {
                                        replace: true,
                                    })
                                }
                            }
                        })
                } catch (error) {
                    toast.error('Ошибка при отправке баг-репорта', error)
                }
            } catch (error) {
                Sentry.captureException(error)
                toast.error('Ошибка: ', error)
            }
        },
    })
    const formikHandleSubmit = (e: any) => {
        if (
            values.title.length >= 6 &&
            values.description.length >= 10 &&
            values.steps.length >= 10
        ) {
            handleSubmit(e)
        } else {
            toast.error('Заполните форму')
            e.preventDefault()
        }
    }

    return (
        <Layout title="Bug Report">
            <div className={styles.page}>
                <div className={styles.container}>
                    <div ref={containerRef} className={styles.main_container}>
                        <Container
                            titleName={'Bug Report'}
                            description={
                                'Опишите свою проблему чтоб мы могли решить её.'
                            }
                            imageName={'bugReport'}
                        ></Container>
                        <div className={styles.container30x15}>
                            <div className={theme.container}>
                                <div className={theme.switchProblem}>
                                    <button
                                        className={`${theme.switchButton} ${activeForm === 1 ? theme.switchButtonActive : ''}`}
                                        onClick={() => setActiveForm(1)}
                                    >
                                        <MdOpenInBrowser size={24} /> Проблема
                                        приложения
                                    </button>
                                    <button
                                        className={`${theme.switchButton} ${activeForm === 2 ? theme.switchButtonActive : ''}`}
                                        onClick={() => setActiveForm(2)}
                                    >
                                        <MdColorLens size={24} /> Проблема UI/UX
                                    </button>
                                </div>
                                {activeForm === 1 && (
                                    <form onSubmit={formikHandleSubmit}>
                                        {' '}
                                        {/* Добавлен onSubmit */}
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
                                                    maxLength={64}
                                                    type="text"
                                                    name="title"
                                                    value={values.title}
                                                    placeholder="заголовок"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                />
                                                {touched.title &&
                                                    errors.title && (
                                                        <div
                                                            className={
                                                                inputStyle.error
                                                            }
                                                        >
                                                            {errors.title}
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                className={
                                                    inputStyle.textInputContainer
                                                }
                                            >
                                                <div>Описание проблемы</div>
                                                <textarea
                                                    style={{ height: '130px' }}
                                                    maxLength={1024}
                                                    placeholder="описание"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                />
                                                {touched.description &&
                                                    errors.description && (
                                                        <div
                                                            className={
                                                                inputStyle.error
                                                            }
                                                        >
                                                            {errors.description}
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                className={
                                                    inputStyle.textInputContainer
                                                }
                                            >
                                                <div>
                                                    Шаги воспроизведения
                                                    проблемы
                                                </div>
                                                <textarea
                                                    style={{ height: '170px' }}
                                                    maxLength={1024}
                                                    placeholder="опишите шаги"
                                                    name="steps"
                                                    value={values.steps}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                />
                                                {touched.steps &&
                                                    errors.steps && (
                                                        <div
                                                            className={
                                                                inputStyle.error
                                                            }
                                                        >
                                                            {errors.steps}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className={theme.rightPos}>
                                                <button
                                                    type="submit"
                                                    className={theme.sendButton}
                                                >
                                                    Отправить
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                {activeForm === 2 && (
                                    <form onSubmit={handleSubmit}>
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
                                                    maxLength={64}
                                                    placeholder="заголовок"
                                                    name="title"
                                                    value={values.title}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                />
                                                {touched.title &&
                                                    errors.title && (
                                                        <div
                                                            className={
                                                                inputStyle.error
                                                            }
                                                        >
                                                            {errors.title}
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                className={
                                                    inputStyle.textInputContainer
                                                }
                                            >
                                                <div>Описание проблемы</div>
                                                <textarea
                                                    style={{ height: '130px' }}
                                                    placeholder="описание"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                />
                                                {touched.description &&
                                                    errors.description && (
                                                        <div
                                                            className={
                                                                inputStyle.error
                                                            }
                                                        >
                                                            {errors.description}
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                className={
                                                    inputStyle.textInputContainer
                                                }
                                            >
                                                <div>Скриншоты</div>
                                                <div
                                                    className={
                                                        inputStyle.styledInput
                                                    }
                                                >
                                                    {values.images.map(
                                                        (src, index) => (
                                                            <div
                                                                key={index}
                                                                className={
                                                                    inputStyle.uploadedImage
                                                                }
                                                            >
                                                                <img
                                                                    src={`data:image/jpeg;base64,${Buffer.from(
                                                                        src.buffer,
                                                                    ).toString(
                                                                        'base64',
                                                                    )}`}
                                                                    alt={`Uploaded ${index + 1}`}
                                                                    onClick={() =>
                                                                        handleImageClick(
                                                                            index,
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteImage(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDeleteForever
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            values.images
                                                                .length >= 5
                                                        }
                                                        className={
                                                            inputStyle.uploadButton
                                                        }
                                                        onClick={
                                                            handleAddImageClick
                                                        }
                                                    >
                                                        <MdAdd size={34} />
                                                    </button>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/x-png,image/png,image/jpeg,image/jpg,image/webp"
                                                        style={{
                                                            display: 'none',
                                                        }}
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className={theme.rightPos}>
                                                <button
                                                    type="submit"
                                                    className={theme.sendButton}
                                                >
                                                    Отправить
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                {selectedImageIndex != null && (
                                    <div
                                        className={theme.fullScreenOverlay}
                                        onWheel={handleWheel}
                                        onMouseMove={handleMouseMove}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                    >
                                        <div
                                            className={
                                                theme.fullScreenImageContainer
                                            }
                                        >
                                            <img
                                                src={`data:image/jpeg;base64,${Buffer.from(
                                                    values.images[
                                                        selectedImageIndex
                                                    ].buffer,
                                                ).toString('base64')}`}
                                                alt="Full screen"
                                                ref={imageRef}
                                                className={
                                                    theme.fullScreenImage
                                                }
                                                style={{
                                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                                    cursor: dragging
                                                        ? 'grabbing'
                                                        : 'default',
                                                }}
                                                onMouseDown={handleMouseDown}
                                            />
                                            <div className={theme.countSelect}>
                                                {`Картинка ${selectedImageIndex + 1}/${values.images.length}`}
                                            </div>
                                            <button
                                                className={theme.closeButton}
                                                onClick={handleClose}
                                            >
                                                <MdClose size={24} />
                                            </button>
                                            {showHotKeyInfo && (
                                                <div className={theme.hotKey}>
                                                    <div
                                                        className={
                                                            theme.hotKeyInfo
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                theme.hotKeyMainInfo
                                                            }
                                                        >
                                                            Scale
                                                        </div>
                                                        /
                                                        <div>
                                                            CTRL + MOUSE 3
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            theme.hotKeyInfo
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                theme.hotKeyMainInfo
                                                            }
                                                        >
                                                            dragging
                                                        </div>
                                                        /<div>MOUSE 3</div>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                className={theme.prevButton}
                                                onClick={handlePrev}
                                            >
                                                <MdChevronLeft size={24} />
                                            </button>
                                            <button
                                                className={theme.nextButton}
                                                onClick={handleNext}
                                            >
                                                <MdChevronRight size={24} />
                                            </button>
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
