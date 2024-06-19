import axios from 'axios'

const http = axios.create({
    baseURL: `http://localhost:${window.electron.corsAnywherePort()}/`,
})

export default http
