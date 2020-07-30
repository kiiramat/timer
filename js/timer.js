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

const clockAdderButton = document.querySelector("[clock-adder]");
clockAdderButton.addEventListener("click", () => {
  const newClock = new Clock("[clocks-container]");
  newClock.draw();
  clocks.push(newClock)
});





  // let endtime = 0;
// let timeInterval = null;


// /*Calculate the remaining time*/
// function getTimeRemaining(endtime) {
//   const total = Date.parse(endtime) - Date.parse(new Date());
//   const seconds = Math.floor( (total/1000) % 60);
//   const minutes = Math.floor( (total/1000/60) % 60)

//   /*Output the clock data as a reusable Object*/
//   return {
//     total, 
//     minutes, 
//     seconds
//   };
// }


// function updateClock(){
//   const t = getTimeRemaining(endtime);

//   /*clock variable to store a reference yo the clock container div*/
//   const minutesInput = document.querySelector('[clock-setter="minutes"]');
//   const secondsInput = document.querySelector('[clock-setter="seconds"]');
//   /*only updates the numbers instead of the full clock*/
//   minutesInput.value = ('0' + t.minutes).slice(-2);
//   secondsInput.value = ('0' + t.seconds).slice(-2);


//   if (t.total <= 0) {
//     clearInterval(timeinterval);
//   }
// }


// /*setInterval() method repeatedly calls a function or executes a code snippet, with a fixed time delay between each call. It returns an interval ID which uniquely identifies the interval, so you can remove it later by calling clearInterval()*/
// function initializeClock(){
//   updateClock(); // run function once at first to avoid delay
//   timeInterval = setInterval(updateClock,1000);
// }


// function start() {
//   const minutesInput = document.querySelector('[clock-setter="minutes"]');
//   const secondsInput = document.querySelector('[clock-setter="seconds"]');
//   /*transform user minutes and seconds into miliseconds*/
//   const userMinutes = minutesInput.value*60*1000;
//   const userSeconds = secondsInput.value*1000;
//   /*set a valid End Date*/
//   const currentTime = Date.parse(new Date());
//   endtime = new Date(currentTime + userMinutes + userSeconds);
//   initializeClock();
// }


// function pause() {
//   clearInterval(timeInterval);
// }

// function reset() {
//   pause();
//   const minutesInput = document.querySelector('[clock-setter="minutes"]');
//   const secondsInput = document.querySelector('[clock-setter="seconds"]');
//   minutesInput.value = 0;
//   secondsInput.value = 0;
// }


//-------------------------

//iniitialize() {
//     const startButton = document.querySelector(`${this._selector} [clock-button="start"]`);
//     const pauseButton = document.querySelector(`${this._selector} [clock-button="pause"]`);
//     const resetButton = document.querySelector(`${this._selector} [clock-button="reset"]`);

//     startButton.addEventListener("click", () => {
//       this.start();
//     });
//     pauseButton.addEventListener("click", () => {
//       this.pause();
//     });
//     resetButton.addEventListener("click", () => {
//       this.reset();
//     });
//}

//------------------------------------------------------

// const clockAdderbutton = document.querySelector("[clock-adder]");
// clockAdderbutton.addEventListener("click", () => {
//   new Clock("[clocks-container]").draw();
// });