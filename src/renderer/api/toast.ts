import toast, { Renderable, ToastOptions } from 'react-hot-toast'

const style = {
    background: '#333',
    color: '#fff',
}

const iToast = {
    success: (message: Renderable, options?: any) =>
        createToast('success', message, options),
    error: (message: Renderable, options?: any) =>
        createToast('error', message, options),
    loading: (message: Renderable, options?: any) =>
        createToast('loading', message, options),
}

function createToast(
    type: 'success' | 'error' | 'loading',
    message: Renderable,
    options?: ToastOptions,
) {
    toast[type](message, {
        ...options,
        style,
    })
}

export default iToast
