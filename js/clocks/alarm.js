class Alarm extends Clock {
    constructor(selector, clockConfiguration) {
        const _clockConfiguration = clockConfiguration || new ClockConfiguration();
        _clockConfiguration.type = ClockTypes.alarm;
        super(selector, _clockConfiguration);
        
        this._clock = null;
        this._circle = null;

        //time variables
        this._alarmUserHours = null;
        this._alarmUserMinutes = null;
        this._endtimeInMin = null;
        this._nowTimeInMin = null;

        //buttons
        this._resetButtonOn = false;
        
        //pointers
        this._endtimeHoursPointer = null;
        this._hoursPointer = null;
        this._minutesPointer = null;
        this._secondsPointer = null;
    }


    getTimeRemainingForAlarm() {
        this._nowTimeInMin = (new Date().getHours() * 60) + new Date().getMinutes();
        return Utilities.getRemainingTimeForAlarm(this._endtimeInMin, this._nowTimeInMin);
    }


    _updateClock() {
        this.getTimeRemainingForAlarm();

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
        if (this.getTimeRemainingForAlarm() === 0 && new Date().getSeconds() === 0) {
            this.reset();

            if (this.config.isYoutubeLink) {
                this._player.playVideo();
            } else if (this._canPlay) {
                this._audio.play();
            }

            this._resetButton.classList.remove("hidden");
            this._startButton.classList.add("hidden");
            this._resetButtonOn = true;
        }
    }


    initializeClock() {
        this._updateClock(); // run function once at first to avoid delay

        this._timeInterval = setInterval(() => {
            this._updateClock();
        }, 1000);
    }



    _startAlarm(timeSum) {
        this.initializeClock();
        this._isPlaying = true;
    }


    start() {
        /**
         * transform user input to miliseconds
         */
        this._alarmUserHours = Number(this._hoursInput.value);
        this._alarmUserMinutes = Number(this._minutesInput.value);
        this._endtimeInMin = (this._alarmUserHours * 60) + this._alarmUserMinutes
        this._startAlarm(this._endtimeInMin);
        

        /**
         * endtime hours pointer calculation
         */
        const endtimeHoursDeg = ((this._hoursInput.value * (360/12)) + (((360/12)/60) * this._minutesInput.value));
        this._endtimeHoursPointer.setAttributeNS(null, 'transform', `translate(75,75) rotate(${endtimeHoursDeg})`);

        
        this._circle.classList.remove("hidden");
        this._clock.classList.add("hidden");
        this._resetButton.classList.remove("hidden");
        this._startButton.classList.add("hidden");     
    }


    reset() {
        this._pause();

        if (this._resetButtonOn === true) {
            /*audio*/
            if (this.config.isYoutubeLink) {
                this._player.stopVideo();    
            } else if (this._canPlay) {
                this._audio.pause();
                this._audio.currentTime = 0;
            } 
            
            this._resetButton.classList.add("hidden");
            this._startButton.classList.remove("hidden");
            this._resetButtonOn = false;
            return;
        }

        this._circle.classList.add("hidden");
        this._clock.classList.remove("hidden");
        this._resetButton.classList.add("hidden");
        this._startButton.classList.remove("hidden");
    }


    drawTitleElement() {
        this._drawTitleElement();
        this._titleInput.classList.add("alarm-input");
    }


    drawAudioInputElement() {
        this._drawAudioInputElement();
        this._audioLinkInput.classList.add("alarm-audio-input");
        this._shortAudioTitleInput.classList.add("alarm-short-audio-title");
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


    _createStartButton() {
        /**
         * start and reset buttons
         */
        this._startButton = ElementUtilities.createButtonElement(null, 'start-button', () => {
            this.start();
        });

        this._resetButton = ElementUtilities.createButtonElement(null, 'reset-button', () => {
            this.reset();
        });
    }


    drawHtmlElements() {
        /**
         * start, reset and delete buttons
         */ 
        this._createStartButton();
        this._startImage = ElementUtilities.createImage("start-button-image", "img/alarmStartButton.svg");
        this._resetImage = ElementUtilities.createImage("reset-button-image", "img/alarmResetButton.svg");
        this._createDeleteButton();
        const deleteImage = ElementUtilities.createImage("delete-button-image", "img/alarmDeleteButton.svg");

        this._resetButton.classList.add("hidden");

        const clockButtons = document.createElement("div");
        clockButtons.className = 'alarm-clock-buttons';
        
        clockButtons.append(this._startButton);
        this._startButton.append(this._startImage);
        
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