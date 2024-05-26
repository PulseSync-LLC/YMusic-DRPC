import log4js from 'log4js'
import path from 'path'
import { app } from 'electron'

// Log file output path, here we choose logs under UserData Path
// Is C: \ Users \ XXX \ AppData \ Roaming \ MyApp \ logs on my computer
const LOG_PATH = path.join(app.getPath('userData'), 'logs')

log4js.configure({
    appenders: {
        out: {
            type: 'console',
        },
        // Setup daily: dates, data file type, Datafiel pay attention to set Pattern, AlwaysInCludepattern properties
        alldateFileLog: {
            type: 'dateFile',
            filename: path.join(LOG_PATH, 'log'),
            Pattern: 'yyy-mm-dd.log', // Generate every day to splicing to FileName
            AlwaysInCludePattern: true, // Always include Pattern
        },
        httpLog: {
            type: 'dateFile',
            filename: path.join(LOG_PATH, 'http'),
            pattern: 'yyyy-MM-dd.log',
            KeepfileExt: true, // Do you need to add ".log" suffix
            alwaysIncludePattern: true,
        },
        renderProccessLog: {
            type: 'dateFile',
            filename: path.join(LOG_PATH, 'renderer'),
            pattern: 'yyyy-MM-dd.log',
            keepFileExt: true,
            alwaysIncludePattern: true,
        },
        mainProccessLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'main.log'),
            keepFileExt: true,
            MaxLogsize: 1024 * 1024 * 100, // File maximum accommodation value
            backups: 3,
        },
        crashLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'crash.log'),
        },
        // Error Log Type: Filter Type LogleVelfilter, write the Error log to write into the specified file
        errorLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'error.log'),
        },
        error: {
            type: 'logLevelFilter',
            level: 'error',
            appender: 'errorLog',
        },
    },
    // Different grade logs append to different output: appenders: ['out', 'allLog'] categories as the key name of the getLogger method
    categories: {
        date: {
            appenders: ['out', 'alldateFileLog'],
            level: 'debug',
        },
        http: {
            appenders: ['out', 'httpLog'],
            level: 'debug',
        },
        main: {
            appenders: ['out', 'mainProccessLog'],
            level: 'debug',
        },
        renderer: {
            appenders: ['renderProccessLog'],
            level: 'debug',
        },
        crash: {
            appenders: ['out', 'crashLog'],
            level: 'debug',
        },
        default: {
            appenders: ['out', 'alldateFileLog'],
            level: 'debug',
        },
    },
})
export default {
    default: log4js.getLogger('date'),
    http: log4js.getLogger('http'),
    main: log4js.getLogger('main'),
    renderer: log4js.getLogger('renderer'),
    crash: log4js.getLogger('crash'),
}
