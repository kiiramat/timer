class Timer extends Clock {
    constructor (selector, clockConfiguration) {
        super(selector, clockConfiguration);

        this._secondsLetter = null;
    }


    _updateClock() {
        const t = this.getTimeRemaining();

        /*clock variable to store a reference yo the clock container div*/
        /*only updates the numbers instead of the full clock*/
        this._minutesInput.value = ('0' + t.minutes).slice(-2);
        this._secondsInput.value = ('0' + t.seconds).slice(-2);

        /*pointer calculation*/
        if (this._divideCircleInXParts === 0) {
            this._divideCircleInXParts = 360 / ((this._minutesInput.value * 60) + Number(this._secondsInput.value));
        }
        const deg = 360 - (this._divideCircleInXParts * this._iteration);
        this._translationCircleGroup.setAttributeNS(null, 'transform', `rotate(${deg})`);
        this._iteration++;

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
        const userMinutes = this._minutesInput.value * 60 * 1000;
        const userSeconds = this._secondsInput.value * 1000;
        this._start(userMinutes + userSeconds);
        if (this._hasStarted) {
            this._startImage.classList.add("hidden");
            this._pauseImage.classList.remove("hidden");
        }
    }


    pause() {
        this._pause();
        this._isPlaying = false;
        /*pointer*/
        this._iteration--;
    }


    reset() {
        this.pause();
        this._minutesInput.value = "";
        this._secondsInput.value = "";
        this._startImage.classList.remove('hidden');
        this._pauseImage.classList.add("hidden");

        /*for pointer calculation in updateClock*/
        this._divideCircleInXParts = 0;
        this._iteration = 1;

        /*pointer*/
        if (this._waitUntilTheEnd) {
            setTimeout(() => {
                this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(360)');
            }, 1000); /*wait until clock reaches 00 seconds*/
            this._waitUntilTheEnd = false;
        } else {
            this._translationCircleGroup.setAttributeNS(null, 'transform', 'rotate(360)');
        }
        this._reset();
    }


    _createMinutesAndSeconds() {
        /**
         * minutes and seconds
         */
        this._minutesInput = ElementUtilities.createNumberInputElement('timer-minutes-input', '59', "timer-minutes", "00", () => {
            this.config.minutes = Utilities.padValue(this._minutesInput.value);
            this._minutesInput.value = this.config.minutes;
        });
        this._minutesInput.value = this.config.minutes;

        this._secondsInput = ElementUtilities.createNumberInputElement('timer-seconds-input', '59', "timer-seconds", "00", () => {
            this.config.seconds = Utilities.padValue(this._secondsInput.value);
            this._secondsInput.value = this.config.seconds;
        });
        this._secondsInput.value = this.config.seconds;

        this._minutesLetter = document.createElement("span");
        this._minutesLetter.className = "minutes-letter";
        this._minutesLetter.innerHTML = "m";

        this._secondsLetter = document.createElement("span");
        this._secondsLetter.className = "seconds-letter";
        this._secondsLetter.innerHTML = "s";
    }


    _createStartPauseButton() {
        /**
         * start-pause and reset buttons
         */
        this._startButton = ElementUtilities.createButtonElement(null, 'start-button', () => {
            if (this._isPlaying) {
                this.pause();
                this._startImage.classList.remove("hidden");
                this._pauseImage.classList.add("hidden");
            } else {
                this.start();
            }
        });
        this._resetButton = ElementUtilities.createButtonElement(null, 'reset-button', () => {
            this.reset();
        });
    }


    drawHtmlElements() {
        this._createMinutesAndSeconds();

        const clock = document.createElement("div");
        clock.className = 'timer-clock-input';
        clock.append(this._minutesInput);
        clock.append(this._minutesLetter);
        clock.append(this._secondsInput);
        clock.append(this._secondsLetter);

        /**
         * start, pause, reset and delete buttons
         */ 
        this._createStartPauseButton();
        this._startImage = ElementUtilities.createImage("start-button-image", "../../img/timerStartButton.svg");
        this._pauseImage = ElementUtilities.createImage("pause-button-image", "../../img/timerPauseButton.svg");
        this._resetImage = ElementUtilities.createImage("reset-button-image", "../../img/timerResetButton.svg");
        this._createDeleteButton();
        const deleteImage = ElementUtilities.createImage("delete-button-image", "../../img/timerDeleteButton.svg");

        const clockButtons = document.createElement("div");
        clockButtons.className = 'timer-clock-buttons';
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

        this._clockDiv.append(clock);
        this._clockDiv.append(clockButtons);
    }


    drawSVGElements() {
        const circle = document.createElement('div');
        circle.setAttributeNS(null, 'class', 'timer-svg-div');
        const svgElement = SvgUtilities.createSVG();
        const g1Element = SvgUtilities.createSvgG("translate(75,75)");
        const circle1Element = SvgUtilities.createSvgCircle('50', null, null, 'base-circle');
        const g2Element = SvgUtilities.createSvgG('rotate(-90)');
        const circle2Element = SvgUtilities.createSvgCircle('50', null, null, 'progress-circle');
        this._translationCircleGroup = SvgUtilities.createSvgG(`rotate(360)`, 'pointer-circle', true);
        const circle3Element = SvgUtilities.createSvgCircle('6', '50', '0');

        circle.append(svgElement);
        svgElement.append(g1Element);
        g1Element.append(circle1Element);
        g1Element.append(g2Element);
        g2Element.append(circle2Element);
        g2Element.append(this._translationCircleGroup);
        this._translationCircleGroup.append(circle3Element);
        this._clockDiv.append(circle);
    }
    

    draw() {
        this._clockDiv = document.createElement("div");
        this._clockDiv.className = "clock-div";
        this.drawTitleElement();
        this.drawAudioInputElement();
        this.drawSVGElements();
        this.drawHtmlElements();
        this._container.append(this._clockDiv);
    }
}