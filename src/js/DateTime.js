const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit",
    numeric: "always",
    style: "long",
});
const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: 24 * 60 * 60 * 1000 * 365 / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}

function dateArrayToDate(dateArray) {
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4])
}

const getRelativeTime = (d1, d2 = new Date()) => {
    const elapsed = d1 - d2

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (let u in units)
        if (Math.abs(elapsed) > units[u] || u === 'second')
            return relativeTimeFormat.format(Math.round(elapsed / units[u]), u)
}

export {dateArrayToDate, getRelativeTime}