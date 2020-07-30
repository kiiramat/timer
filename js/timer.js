const clocks = [];

//if nothing from URL:
if (location.hash === '') {
    clocks.push(new Clock("[clocks-container]"));
} else {
    const clocksConfiguration = URL_HANDLER.pullFromUrl();
    clocksConfiguration.forEach((clockConfig) => {
        clocks.push(new Clock("[clocks-container]", clockConfig));
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

const clockAdderButton = document.querySelector("[clock-adder]");
clockAdderButton.addEventListener("click", () => {
    const newClock = new Clock("[clocks-container]");
    newClock.draw();
    clocks.push(newClock);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});