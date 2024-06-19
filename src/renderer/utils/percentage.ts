export const getValue = (percent: number, value: number) => {
    return (value * percent) / 100
}

export const getPercent = (value: number, total: number) => {
    return (value / total) * 100
}
