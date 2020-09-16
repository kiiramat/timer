const Utilities = {}

/**
 * Gets the difference between the remaining time and now
 * @param {Number} endtime 
 * @returns {*} JSON structure with hours, minutes and seconds and the total time as milliseconds 
 */
Utilities.getTimeRemaining = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000*60*60)) % 24);

    /*Output the clock data as a reusable Object*/
    return {
        total,
        hours,
        minutes,
        seconds
    };
}


Utilities.padValue = (value) => {
    return value.length === 1 ? ('0' + value) : (value.slice(-2))
}
