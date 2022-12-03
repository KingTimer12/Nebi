const moment = require('moment')

const toCompare = (old, now) => {

    //'28/12/2022 09:06:59'
    const timestampOld = moment.parseZone(old, 'DD/MM/yyyy hh:mm:ss').toDate().getTime()
    const timestampNow = moment.parseZone(now, 'DD/MM/yyyy hh:mm:ss').toDate().getTime()

    return timestampNow <= timestampOld
}

module.exports = {toCompare}