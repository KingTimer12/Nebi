const moment = require('moment')

const unix = (ts) => {
    return moment.unix(ts)
}

const toMoment = (timestamp) => {
    return moment(timestamp)
}

const getNextSunday = (timestamp) => {
    return moment(timestamp).day(7).toDate()
}

const transformTimestamp = (dateString) => {
    return moment.parseZone(dateString, 'DD/MM/yyyy hh:mm:ss').toDate().getTime()
}

const toCompare = (old, now) => {

    //'28/12/2022 09:06:59'
    const timestampOld = moment.parseZone(old, 'DD/MM/yyyy hh:mm:ss').toDate().getTime()
    const timestampNow = moment.parseZone(now, 'DD/MM/yyyy hh:mm:ss').toDate().getTime()

    //22/09/2022 22:03:14 <= 01/12/2022 00:00:00
    return timestampNow <= timestampOld
}

module.exports = {toCompare, transformTimestamp, getNextSunday, toMoment, unix}