class Alarm extends Clock {
    constructor(selector, clockConfiguration) {
        super(selector, clockConfiguration);
        
        this._hoursInput = null;
        this._clock = null;
        this._circle = null;
        
        //pointers
        this._endtimeHoursPointer = null;
        this._hoursPointer = null;
        this._minutesPointer = null;
        this._secondsPointer = null;
    }


    _updateClock() {
        const t = this.getTimeRemaining();

        /*clock variable to store a reference yo the clock container div*/
        /*only updates the numbers instead of the full clock*/
        this._hoursInput.value = ('0' + t.hours).slice(-2);
        this._minutesInput.value = ('0' + t.minutes).slice(-2);

        /**
         * hours, minutes and seconds pointer calculation
         */
        const hoursDeg = ((new Date().getHours() * (360/12)) + (((360/12)/60) * new Date().getMinutes()));
        this._hoursPointer.setAttributeNS(null, 'transform', `translate(75,75) rotate(${hoursDeg})`);
        
        const minutesDeg = ((new Date().getMinutes() * 360) / 60);
        this._minutesPointer.setAttributeNS(null, 'transform', `translate(75,75) rotate(${minutesDeg})`);

        const secondsDeg = ((new Date().getSeconds() * 360) / 60);
        this._secondsPointer.setAttributeNS(null, 'transform', `translate(75,75) rotate(${secondsDeg})`);

        /*time reaches zero*/
        if (t.total <= 0) {
            this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(0)');
            this._waitUntilTheEnd = true;
            this.reset();
            if (this.config.isYoutubeLink) {
                this._player.playVideo();
            } else if (this._canPlay) {
                this._audio.play();
            }
        }
    }


    initializeClock() {
        this._updateClock(); // run function once at first to avoid delay

        this._timeInterval = setInterval(() => {
            this._updateClock();
        }, 1000);
    }


    start() {
        /**
         * transform user input to miliseconds
         */
        const userHours = this._hoursInput.value * 1000 * 60 * 60;
        const userMinutes = this._minutesInput.value * 60 * 1000;
        this._start(userHours + userMinutes);
        /**
         * endtime hours pointer calculation
         */
        const endtimeHoursDeg = ((this._hoursInput.value * (360/12)) + (((360/12)/60) * this._minutesInput.value));
        this._endtimeHoursPointer.setAttributeNS(null, 'transform', `translate(75,75) rotate(${endtimeHoursDeg})`);
        this._circle.classList.remove("hidden");
        this._clock.classList.add("hidden");
    }


    reset() {
        this.pause();
        this._hoursInput.value = "";
        this._minutesInput.value = "";
        this._reset();
        this._circle.classList.add("hidden");
        this._clock.classList.remove("hidden");
    }


    drawTimeInput() {
        this._hoursInput = ElementUtilities.createNumberInputElement('alarm-hours-input', "23", "alarm-hours", "00", () => {
            this.config.hours = Utilities.padValue(this._hoursInput.value);
            this._hoursInput.value = this.config.hours;
        });
        this._hoursInput.value = this.config.hours;

        this._minutesInput = ElementUtilities.createNumberInputElement('alarm-minutes-input', '59', "alarm-minutes", "00", () => {
            this.config.minutes = Utilities.padValue(this._minutesInput.value);
            this._minutesInput.value = this.config.minutes;
        });
        this._minutesInput.value = this.config.minutes;

        const hoursLetter = document.createElement("span");
        hoursLetter.className = "alarm-hours-letter";
        hoursLetter.innerHTML = "h";

        this._minutesLetter = document.createElement("span");
        this._minutesLetter.className = "alarm-minutes-letter";
        this._minutesLetter.innerHTML = "m";

        this._clock = document.createElement("div");
        this._clock.className = 'alarm-clock-input';
        const alarmDigits = document.createElement('div');
        alarmDigits.className = 'alarm-digits';
        this._clock.append(alarmDigits);
        alarmDigits.append(this._hoursInput);
        alarmDigits.append(hoursLetter);
        alarmDigits.append(this._minutesInput);
        alarmDigits.append(this._minutesLetter);

        this._clockDiv.append(this._clock);
    }


    drawHtmlElements() {
        /**
         * start, pause, reset and delete buttons
         */ 
        this._createStartPauseButton();
        this._startImage = ElementUtilities.createImage("start-button-image", "../../img/alarmStartButton.svg");
        this._pauseImage = ElementUtilities.createImage("pause-button-image", "../../img/alarmPauseButton.svg");
        this._resetImage = ElementUtilities.createImage("reset-button-image", "../../img/alarmResetButton.svg");
        this._createDeleteButton();
        const deleteImage = ElementUtilities.createImage("delete-button-image", "../../img/alarmDeleteButton.svg");

        const clockButtons = document.createElement("div");
        clockButtons.className = 'alarm-clock-buttons';
        const startPauseButton = document.createElement("div");
        startPauseButton.className = 'start-pause-button';
        
        clockButtons.append(startPauseButton);
        startPauseButton.append(this._startButton);
        this._startButton.append(this._startImage);
        this._startButton.append(this._pauseImage);
        this._pauseImage.classList.add("hidden");
        
        clockButtons.append(this._resetButton);
        this._resetButton.append(this._resetImage);
        
        clockButtons.append(this._deleteButton);
        this._deleteButton.append(deleteImage);

        this._clockDiv.append(clockButtons);
    }


    drawSVGElements() {
        this._circle = document.createElement("div");
        this._circle.setAttributeNS(null, "class", "alarm-svg-div");
        const svgElement = SvgUtilities.createSVG();
        this._endtimeHoursPointer = SvgUtilities.createSvgPath("endtime-alarm-hours-pointer", "translate(75,75) rotate(0)", "M 0,0 V -25");
        this._secondsPointer = SvgUtilities.createSvgPath("alarm-seconds-pointer", 'translate(75,75) rotate(0)', "M 0,0 V -40");
        this._minutesPointer = SvgUtilities.createSvgPath("alarm-minutes-pointer", 'translate(75,75) rotate(0)', "M 0,0 V -38");
        this._hoursPointer = SvgUtilities.createSvgPath("alarm-hours-pointer", "translate(75,75) rotate(0)", "M 0,0 V -25");
        const innerCircle = SvgUtilities.createSvgCircle('2.7081997', '75', '75', 'alarm-inner-circle');
        const outerCircle = SvgUtilities.createSvgCircle('50', '75', '75', 'alarm-outer-circle');

        this._circle.classList.add("hidden");

        this._circle.append(svgElement);
        svgElement.append(this._endtimeHoursPointer);
        svgElement.append(this._minutesPointer);
        svgElement.append(this._hoursPointer);
        svgElement.append(this._secondsPointer);
        svgElement.append(innerCircle);
        svgElement.append(outerCircle);
        this._clockDiv.append(this._circle);
    }


    draw() {
        this._clockDiv = document.createElement("div");
        this._clockDiv.className = "clock-div";
        this.drawTitleElement();
        this.drawAudioInputElement();
        this.drawTimeInput();
        this.drawSVGElements();
        this.drawHtmlElements();
        this._container.append(this._clockDiv);
    }
}