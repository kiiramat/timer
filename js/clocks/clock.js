class Clock {
    constructor(selector, clockConfiguration) {
        this.id = Math.ceil(Math.random() * 1000000);
        this.config = clockConfiguration || new ClockConfiguration();

        this._endtime;
        this._timeInterval = null;

        //for timer use
        this._isPlaying = false;
        this._hasStarted = false;

        //original users input - for alarm use
        this._acceptsNewInput = false;
        this._hoursInitialUserInput = null;
        this._minutesInitialUserInput = null;

        //DOM Elements
        this._container = document.querySelector(selector);
        this._clockDiv = null;
        this._audioLinkInput = null;
        this._hoursInput = null;
        this._minutesInput = null;
        this._minutesLetter = null;
        this._secondsInput = null;
        this._startButton = null;
        this._startImage = null;
        this._pauseImage = null;
        this._resetButton = null;
        this._resetImage = null;
        this._deleteButton = null;

        //pointer
        this._translationCircleGroup = null;
        this._divideCircleInXParts = 0;
        this._iteration = 1;
        this._waitUntilTheEnd = false;

        //audio
        this._audio = null;
        this._canPlay = false;

        //youtube
        this._player;
        this._playerDone = false;
        this.youtubeVideoId;
        this._youtubeDivContainer = null;

        this._shortAudioTitleInput = null;
    }

    
    setAudio(mp3Link) {
        this._audio = new Audio(mp3Link);
        this._canPlay = false;
        this._audio.addEventListener("canplaythrough", event => {
            this._canPlay = true;
        });
    }


    clearAudio() {
        this._audio = null;
        this._canPlay = false;
    }


    _createYoutubeDiv() {
        const divTag = document.createElement("div");
        divTag.id = `youtube-${this.id}`
        return divTag;
    }


    createPlayerHelper() {
        new YT.Player(`youtube-${this.id}`, {
            height: '0',
            width: '0',
            videoId: this.youtubeVideoId,
            events: {
                'onReady': (event) => {
                    this.onPlayerReady(event);
                }
            }
        });
    }


    createPlayer() {
        if (isPlayerReady) {
            this.createPlayerHelper();
        } else {
            addEventListener("youtube-player-ready", () => {
                this.createPlayerHelper();
            });
        }
    }


    drawYoutubeElement() {
        this.youtubeVideoId = this.config.audioLink.substr(this.config.audioLink.lastIndexOf("?v=") + 3);

        this._youtubeDivContainer = document.createElement("div");
        this._youtubeDivContainer.className = "youtube-audio";
        const youtubeDiv = this._createYoutubeDiv();
        this._youtubeDivContainer.append(youtubeDiv);
        this._clockDiv.append(this._youtubeDivContainer);
        this.createPlayer()
    }


    clearYoutube() {
        this._player = null;
        this.youtubeVideoId = null;
        if (this._youtubeDivContainer) {
            this._youtubeDivContainer.parentNode.removeChild(this._youtubeDivContainer);
        }
    }


    //  The API will call this function when the video player is ready.
    onPlayerReady(event) {
        this._player = event.target;
        this._shortAudioTitleInput.value = this._player.playerInfo.videoData.title;
        this.config.shortAudioTitle = this._shortAudioTitleInput.value;
        this._shortAudioTitleInput.value = this.config.shortAudioTitle;
        this._audioLinkInput.classList.add("hidden");
        this._shortAudioTitleInput.classList.remove("hidden");
    }


    stopVideo() {
        this._player.stopVideo();
    }


    getTimeRemaining() {
        return Utilities.getTimeRemaining(this._endtime);
    }
    

    _start(endtime) {
        if (endtime === 0) {
            this._hasStarted = false; 
            return;
        }
        /*set a valid End Date*/
        const currentTime = Date.parse(new Date());
        this._endtime = new Date(currentTime + endtime);
        
        // keeps users original input for alarm
        if (this._acceptsNewInput) {
            this._hoursInitialUserInput = this._hoursInput.value;
            this._minutesInitialUserInput = this._minutesInput.value;
            this._acceptsNewInput = false;
        }
        
        this.initializeClock();
        this._isPlaying = true;
        this._hasStarted = true;
    }


    _pause() {
        clearInterval(this._timeInterval);
    }


    _reset() {
        /*audio*/
        if (this.getTimeRemaining().total <= 0) {
            if (this.config.isYoutubeLink) {
                this._player.stopVideo();
                
            } else if (this._canPlay) {
                this._audio.pause();
                this._audio.currentTime = 0;
            }
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


    drawTitleElement() {
        const headerDiv = document.createElement("div");
        headerDiv.className = 'clock-title';
        const titleInput = this._createTextInputElement("titleId", "title-input", "title", "Insert name");
       
        titleInput.addEventListener("input", () => {
            this.config.title = titleInput.value;
            titleInput.value = this.config.title;
        });
        titleInput.value = this.config.title;

        headerDiv.append(titleInput);

        this._clockDiv.append(headerDiv);
    }


    storeLink(linkToStore, force) {
        if (linkToStore === undefined || linkToStore === null) {
            return;
        }
        this.clearAudio();
        this.clearYoutube();

        //accept youtube link
        if (ClockConfiguration.isYoutubeLink(linkToStore)) {
            this.config.audioLink = linkToStore;
            this.drawYoutubeElement();
        }

        // accept no link or new link
        if (force || linkToStore === "" || linkToStore.match(/http(s?):\/\/.*\/([^\/]+\.)(.{3})$/gmi)) {
            this.config.audioLink = linkToStore;
            this.setAudio(linkToStore);
            this._shortAudioTitleInput.value = linkToStore.substr(linkToStore.lastIndexOf('/') + 1);
            this.config.shortAudioTitle = this._shortAudioTitleInput.value;
            this._shortAudioTitleInput.value = this.config.shortAudioTitle;
            if(this.config.audioLink !== "../../audio/true.mp3") {
                this._audioLinkInput.classList.add("hidden");
                this._shortAudioTitleInput.classList.remove("hidden");
            }
        }
    }

    drawAudioInputElement() {
        const audioDiv = document.createElement("div");
        audioDiv.className = "clock-audio";
        this._audioLinkInput = this._createTextInputElement("audioId", "audio-input", "audio", "Insert audio link");
        this._shortAudioTitleInput = this._createTextInputElement("shortAudioTitleId", "short-audio-title", "shortAudio", "");
        this._shortAudioTitleInput.value = "";
        this._shortAudioTitleInput.classList.add("hidden");
        
        this._audioLinkInput.addEventListener("keydown", (event) => {
            // when you press enter
            if (event.code === 'Enter') {
                this.storeLink(this._audioLinkInput.value);
            }
        });

        this._audioLinkInput.addEventListener("blur", () => {
            this.storeLink(this._audioLinkInput.value);
        });

        this._shortAudioTitleInput.addEventListener("focus", () => {
            if (this.config.audioLink !== "" && !this.config.isDefaultAudioLink) {
                this._audioLinkInput.value = this.config.audioLink;
            }  
            this._audioLinkInput.classList.remove("hidden");
            this._shortAudioTitleInput.classList.add("hidden");
            this._audioLinkInput.focus();
        });

        this.storeLink(this.config.audioLink, true); 

        audioDiv.append(this._audioLinkInput);
        audioDiv.append(this._shortAudioTitleInput);
        this._clockDiv.append(audioDiv);
    }


    _createDeleteButton() {
        /**
         * delete button
         */
        this._deleteButton = ElementUtilities.createButtonElement(null, "delete-button", () => {
            this._clockDiv.parentNode.removeChild(this._clockDiv);
            this.clockDeleted();
        })
    }


    clockDeleted() {
        const event = new CustomEvent("clock-deleted", { detail: this });
        dispatchEvent(event);
    }
}