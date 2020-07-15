class Clock {
    constructor(selector, urlToAudio) {
      this._endtime;
      this._timeInterval = null;
      this._isPlaying = false;
      
      //DOM Elements
      this._container = document.querySelector(selector);
      this._minutesInput = null;
      this._secondsInput = null;
      this._startButton = null;
      this._resetButton = null;
      
      //pointer
      this._translationCircleGroup = null;
      this._divideCircleInXParts = 0;
      this._iteration = 1;
      this._waitUntilTheEnd = false;
      
      this._audio = new Audio(urlToAudio);
      this._canPlay = false;
      this._audio.addEventListener("canplaythrough", event => {
        this._canPlay = true;
      });
    }
    
    
    getTimeRemaining() {
      const total = Date.parse(this._endtime) - Date.parse(new Date());
      const seconds = Math.floor( (total/1000) % 60);
      const minutes = Math.floor( (total/1000/60) % 60)
  
      /*Output the clock data as a reusable Object*/
      return {
        total, 
        minutes, 
        seconds
      };
    }
   
    
    updateClock(){
      const t = this.getTimeRemaining();
      
      /*clock variable to store a reference yo the clock container div*/
      /*only updates the numbers instead of the full clock*/
      this._minutesInput.value = ('0' + t.minutes).slice(-2);
      this._secondsInput.value = ('0' + t.seconds).slice(-2);
      
      /*pointer calculation*/
      if (this._divideCircleInXParts === 0) {
        this._divideCircleInXParts = 360 / ((this._minutesInput.value / 60) + this._secondsInput.value);
      }
      const deg = 360 - (this._divideCircleInXParts * this._iteration);
      this._translationCircleGroup.setAttributeNS(null, 'transform', `rotate(${deg})`);
      this._iteration++;
      
      /*time reaches zero*/
      if (t.total <= 0) {
        this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(0)');
        this._waitUntilTheEnd = true;
        this.reset();
        if (this._canPlay) {
          this._audio.play();
        }  
      }
    }
    
    
    initializeClock(){
      this.updateClock(); // run function once at first to avoid delay
      
      this._timeInterval = setInterval(() => {
        this.updateClock();
      },1000);    
    }
    
    
    start() {
      /*transform user minutes and seconds into miliseconds*/
      const userMinutes = this._minutesInput.value*60*1000;
      const userSeconds = this._secondsInput.value*1000;
      
      if (userMinutes + userSeconds === 0) {
        return;
      }
      /*set a valid End Date*/
      const currentTime = Date.parse(new Date());
      this._endtime = new Date(currentTime + userMinutes + userSeconds);
      this.initializeClock();
      this._isPlaying = true;
      this._startButton.classList.remove('start-button');
      this._startButton.classList.add('pause-button');
    }
    
    
    pause() {
      clearInterval(this._timeInterval);
      this._isPlaying = false;
      this._startButton.classList.remove('pause-button');
      this._startButton.classList.add('start-button');
      /*pointer*/
      this._iteration--;
    }
    
    
    reset() {
      this.pause();
      this._minutesInput.value = "";
      this._secondsInput.value = "";
      this._startButton.classList.remove('pause-button');
      this._startButton.classList.add('start-button');
      /*for pointer calculation in updateClock*/
      this._divideCircleInXParts = 0;
      this._iteration = 1; 
      
      /*pointer*/
      if (this._waitUntilTheEnd) {
        setTimeout(()=>{
          this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(360)');
        }, 1000); /*wait until clock reaches 00 seconds*/
        this._waitUntilTheEnd = false;
      } else {
        this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(360)');  
      }  
      
      /*audio*/
      if (this.getTimeRemaining().total <= 0) {
        this._audio.pause();
        this._audio.currentTime = 0;
      }  
    }
    
    
    _createInputElement(max, clockSetter, placeholder, func) {
      const input = document.createElement("input");
      input.className = "clock-input";
      input.setAttribute("type", "number");
      input.setAttribute("min", "0");
      input.setAttribute("max", max);
      input.setAttribute("clock-setter", clockSetter);
      input.setAttribute("placeholder", placeholder);
      input.addEventListener('input', (event) => {
        const currentValue = event.target.value;
        event.target.value = Math.max(0, Math.min(Number(currentValue), Number(max)));
        func();
      });
      return input;
    }
     
    
    _createButtonElement(text, className, func) {
      const button = document.createElement("button");
      button.className = className;
      button.innerHTML = text;
      button.addEventListener("click", func);
      return button
    }
    
    
    _padInput(value) {
      return value.length === 1 ? ('0' + value) : (value.slice(-2))
    }
    
    
    drawHtmlElements(parent) {
      const clock = document.createElement("div");
      clock.className = 'clock';
      const inputMinutes = this._createInputElement('59', "minutes", "00", () => {
        inputMinutes.value = this._padInput(inputMinutes.value);
      });
      const inputSeconds = this._createInputElement('59', "seconds", "00", () => {
       inputSeconds.value = this._padInput(inputSeconds.value);
      });
      const inputSeparator = document.createElement("span");
      inputSeparator.innerHTML = " : "
      
      const buttons = document.createElement("div");
      buttons.className = 'buttons';
      const startPauseButton = document.createElement("div");
      startPauseButton.className = 'start-pause-button';
      
      this._startButton = this._createButtonElement(null, 'start-button', () => {
        if (this._isPlaying) {
          this.pause();
        } else {
          this.start();
        }
      });
      const resetButton = this._createButtonElement(null, 'reset-button', () => {
        this.reset();
      });
      
      clock.append(inputMinutes);
      clock.append(inputSeparator);
      clock.append(inputSeconds);
      
      buttons.append(startPauseButton);
      startPauseButton.append(this._startButton);
      buttons.append(resetButton);
  
      this._minutesInput = inputMinutes;
      this._secondsInput = inputSeconds;
      parent.append(clock);
      parent.append(buttons);
    }
    
    
    _createSVG() {
      const svg =document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttributeNS(null, 'width', '600px');
      svg.setAttributeNS(null, 'height', '600px');
      svg.setAttributeNS(null, 'viewBox', '0 0 150 150');
      return svg;
    }
    
    
    _createSvgG(transform, id, withTransition) {
      const g = document.createElementNS("http://www.w3.org/2000/svg",'g');
      if (transform) {
        g.setAttributeNS(null, 'transform', transform);
      }
      if (id) {
        g.setAttributeNS(null, "id", id);
      }
      if (withTransition) {
        g.setAttributeNS(null, "style", "transition: all 1s linear");
      }
      return g;
    }
    
    
    _createSvgCircle(r, cx, cy, className) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
      circle.setAttributeNS(null, 'r', r);
      if (cx) {
        circle.setAttributeNS(null, 'cx', cx);  
      }
      if (cy) {
        circle.setAttributeNS(null, 'cy', cy);  
      }
      if (className) {
        circle.setAttributeNS(null, "class", className);
      }
      return circle;
    }
    
    
    drawSVGElements(parent) {
      const circle = document.createElement('div');
      circle.setAttributeNS(null, 'class', 'svg');
      const svgElement = this._createSVG();
      const g1Element = this._createSvgG("translate(75,75)");
      const circle1Element = this._createSvgCircle('50', null, null, 'base-circle');
      const g2Element = this._createSvgG('rotate(-90)');
      const circle2Element = this._createSvgCircle('50', null, null, 'progress-circle');
      this._translationCircleGroup = this._createSvgG(`rotate(360)`, 'pointer-circle', true);
      const circle3Element = this._createSvgCircle('6', '50', '0');
      
      circle.append(svgElement);
      svgElement.append(g1Element);
      g1Element.append(circle1Element);
      g1Element.append(g2Element);
      g2Element.append(circle2Element);
      g2Element.append(this._translationCircleGroup);
      this._translationCircleGroup.append(circle3Element);
      parent.append(circle);
    }
    
    
    draw() {
      var clockDiv = document.createElement("div")
      this.drawSVGElements(clockDiv);
      this.drawHtmlElements(clockDiv);
      this._container.append(clockDiv);
    }
  }
  
  new Clock("[clocks-container]", "../audio/true.mp3").draw();
  new Clock("[clocks-container]").draw();
  





  
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