const clocks = [];

//if nothing from URL:
if (location.hash === '') {
    clocks.push(new Timer("[clocks-container]"));
} else {
    const clocksConfiguration = URL_HANDLER.pullFromUrl();
    clocksConfiguration.forEach((clockConfig) => {
        if (clockConfig.type === ClockTypes.timer){
            clocks.push(new Timer("[clocks-container]", clockConfig));
        } else if (clockConfig.type === ClockTypes.alarm){
            clocks.push(new Alarm("[clocks-container]", clockConfig));
        }      
    })
}

clocks.forEach((clock) => {
    clock.draw();
});

addEventListener("clock-config-changed", () => {
    const allConfigs = clocks.map((clock) => {
        return clock.config;
    });
    URL_HANDLER.pushToUrl(allConfigs);
});

addEventListener("clock-deleted", (event) => {
    clocks.splice(clocks.indexOf(event.detail), 1);
    const allClockConfigs = clocks.map((clock) => {
        return clock.config;
    });
    URL_HANDLER.pushToUrl(allClockConfigs);
});

const timerAdderButton = document.querySelector("[timer-adder]");
timerAdderButton.addEventListener("click", () => {
    const newTimer = new Timer("[clocks-container]");
    newTimer.draw();
    clocks.push(newTimer);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

const alarmAdderButton = document.querySelector("[alarm-adder]");
alarmAdderButton.addEventListener("click", () => {
  const newAlarm = new Alarm("[clocks-container]"); 
  newAlarm.draw();
  clocks.push(newAlarm);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
})