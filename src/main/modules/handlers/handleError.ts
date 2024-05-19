import log from 'electron-log'

const firstLine = (message: string | Error) => {
    if (typeof message === 'string') {
        const [line] = message.split('\n')
        return line
    }
    return message.message.split('\n')[0]
}

export const toPlainError = (error: Error | any) => {
    if (error instanceof Error) {
        return `${error.name} ${firstLine(error.message)}`
    }
    return error
}

export const handleUncaughtException = () => {
    const globalErrorLogger = log.scope('UncaughtException')
    process.on('uncaughtException', (error: Error) => {
        globalErrorLogger.error(toPlainError(error))
    })
}
