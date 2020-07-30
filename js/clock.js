class Clock {
    constructor(selector, clockConfiguration) {
        this.config = clockConfiguration || new ClockConfiguration();

        this._endtime;
        this._timeInterval = null;
        this._isPlaying = false;

        //DOM Elements
        this._container = document.querySelector(selector);
        this._audioLinkInput = null;
        this._minutesInput = null;
        this._secondsInput = null;
        this._startButton = null;
        this._resetButton = null;

        //pointer
        this._translationCircleGroup = null;
        this._divideCircleInXParts = 0;
        this._iteration = 1;
        this._waitUntilTheEnd = false;

        //audio
        this._audio = null;
        this._canPlay = false;
        this.setAudio(this.config.audioLink);
    }

    setAudio(mp3Link) {
        this._audio = new Audio(mp3Link);
        this._canPlay = false;
        this._audio.addEventListener("canplaythrough", event => {
            this._canPlay = true;
        });
    }


    getTimeRemaining() {
        const total = Date.parse(this._endtime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60)

        /*Output the clock data as a reusable Object*/
        return {
            total,
            minutes,
            seconds
        };
    }


    updateClock() {
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
            if (this._canPlay) {
                this._audio.play();
            }
        }
    }


    initializeClock() {
        this.updateClock(); // run function once at first to avoid delay

        this._timeInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }


    start() {
        /*transform user minutes and seconds into miliseconds*/
        const userMinutes = this._minutesInput.value * 60 * 1000;
        const userSeconds = this._secondsInput.value * 1000;

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
            setTimeout(() => {
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


    _createTextInputElement(id, className, name, placeholder) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", id);
        input.setAttribute("class", className);
        input.setAttribute("name", name);
        input.setAttribute("placeholder", placeholder);
        return input;
    }


    drawTitleElement(clockContainer) {
        const headerDiv = document.createElement("div");
        headerDiv.className = 'clock-title';
        const titleInput = this._createTextInputElement("titleId", "title-input", "title", "Insert name");
        titleInput.addEventListener("input", () => {
            this.config.title = titleInput.value;
            titleInput.value = this.config.title;
        });
        titleInput.value = this.config.title;

        headerDiv.append(titleInput);

        clockContainer.append(headerDiv);
    }


    storeLink(linkToStore) {
        if (linkToStore === undefined || linkToStore === null) {
            return;
        }
        // accept no link or new link
        if (linkToStore === "" || linkToStore.match(/http(s?):\/\/.*\/([^\/]+\.)(.{3})$/gmi)) {
            this.config.audioLink = linkToStore;
            this.setAudio(linkToStore);
            this._audioLinkInput.value = linkToStore.substr(linkToStore.lastIndexOf('/') + 1);
        }
    }

    drawAudioElement(clockContainer) {
        const audioDiv = document.createElement("div");
        audioDiv.className = "clock-audio";
        this._audioLinkInput = this._createTextInputElement("audioId", "audio-input", "audio", "Insert audio link");
        this._audioLinkInput.addEventListener("keyup", () => {
            // when you press enter
            if (event.keyCode === KEY.ENTER) {
                this.storeLink(this._audioLinkInput.value);
            }
        });
        this._audioLinkInput.addEventListener("blur", () => {
            this.storeLink(this._audioLinkInput.value);
        });

        this._audioLinkInput.addEventListener("focus", () => {
            if (this.config.audioLink !== "" && !this.config.isDefaultAudioLink) {
                this._audioLinkInput.value = this.config.audioLink;
            }
        });

        this.storeLink(this.config.audioLink);

        audioDiv.append(this._audioLinkInput);
        clockContainer.append(audioDiv);
    }


    _createNumberInputElement(max, clockSetter, placeholder, func) {
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


    drawHtmlElements(clockContainer) {
        /**
         * minutes and seconds
         */
        const clock = document.createElement("div");
        clock.className = 'clock';
        const inputMinutes = this._createNumberInputElement('59', "minutes", "00", () => {
            this.config.minutes = this._padInput(inputMinutes.value);
            inputMinutes.value = this.config.minutes;
        });
        inputMinutes.value = this.config.minutes;

        const inputSeconds = this._createNumberInputElement('59', "seconds", "00", () => {
            this.config.seconds = this._padInput(inputSeconds.value);
            inputSeconds.value = this.config.seconds;
        });
        inputSeconds.value = this.config.seconds;

        const inputSeparator = document.createElement("span");
        inputSeparator.innerHTML = " : "

        /**
         * start-pause and reset buttons
         */
        const clockButtons = document.createElement("div");
        clockButtons.className = 'clockButtons';
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

        /**
         * delete button
         */
        const clockFooter = document.createElement("div");
        clockFooter.className = "clock-footer"
        const delButton = this._createButtonElement("Delete", "delete-button", () => {
            clockContainer.parentNode.removeChild(clockContainer);
            this.clockDeleted();
        })


        clock.append(inputMinutes);
        clock.append(inputSeparator);
        clock.append(inputSeconds);

        clockButtons.append(startPauseButton);
        startPauseButton.append(this._startButton);
        clockButtons.append(resetButton);

        clockFooter.append(delButton);

        this._minutesInput = inputMinutes;
        this._secondsInput = inputSeconds;
        clockContainer.append(clock);
        clockContainer.append(clockButtons);
        clockContainer.append(clockFooter);
    }

    clockDeleted() {
        const event = new CustomEvent("clock-deleted", { detail: this });
        dispatchEvent(event);
    }

    _createSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, 'width', '600px');
        svg.setAttributeNS(null, 'height', '600px');
        svg.setAttributeNS(null, 'viewBox', '0 0 150 150');
        return svg;
    }


    _createSvgG(transform, id, withTransition) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
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
        const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
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


    drawSVGElements(clockContainer) {
        const circle = document.createElement('div');
        circle.setAttributeNS(null, 'class', 'svg-div');
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
        clockContainer.append(circle);
    }

    draw() {
        var clockDiv = document.createElement("div");
        clockDiv.className = "clock-div";
        this.drawTitleElement(clockDiv);
        this.drawAudioElement(clockDiv);
        this.drawSVGElements(clockDiv);
        this.drawHtmlElements(clockDiv);
        this._container.append(clockDiv);
    }
}