const Utilities = {}

/**
 * Gets the difference between the remaining time and now
 * @param {Number} endtime 
 * @returns {*} JSON structure with hours, minutes and seconds and the total time as milliseconds 
 */
Utilities.getTimeRemainingForTimer = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor(total / 1000 / 60);

    /*Output the clock data as a reusable Object*/
    return {
        total,
        minutes,
        seconds
    };
}


Utilities.getRemainingTimeForAlarm = (userTimeinMin, nowTimeInMin) => {
    if (userTimeinMin >= nowTimeInMin){
        return userTimeinMin - nowTimeInMin;
    }
    return (24 * 60) - (nowTimeInMin - userTimeinMin);
}


Utilities.padValue = (value) => {
    return value.length === 1 ? ('0' + value) : (value.slice(-2))
}
