'use strict';

const ClockTypes = {
    "alarm": "ALARM",
    "timer": "TIMER",
    "invalid": null
};

const CLOCK_CONFIG_PROPERTY_DELIMITER = "|:|";

class ClockConfiguration {
    constructor(type, audioLink, shortAudioTitle, title, biggerTimeElement, smallerTimeElement) {
        this._audioLink = audioLink || "audio/true.mp3";
        this._shortAudioTitle = shortAudioTitle || "";
        this.isDefaultAudioLink = !audioLink;
        this._title = title || "";
        this._biggerTimeElement = biggerTimeElement || "";
        this._smallerTimeElement = smallerTimeElement || "";
        this.type = type || null;
    }

    configurationChanged() {
        const event = new CustomEvent("clock-config-changed", { detail: this });
        dispatchEvent(event);
    }

    set audioLink(audioLink) {
        this.isDefaultAudioLink = false;
        this._audioLink = audioLink;
        this.configurationChanged();
    }
    get audioLink() {
        return this._audioLink;
    }


    set shortAudioTitle(shortAudioTitle) {
        this._shortAudioTitle = shortAudioTitle;
        this.configurationChanged();
    }
    get shortAudioTitle() {
        return this._shortAudioTitle;
    }


    set title(title) {
        this._title = title;
        this.configurationChanged();
    }
    get title() {
        return this._title;
    }

    set hours(hours) {
        if (this.type === ClockTypes.alarm) {
            this._biggerTimeElement = hours;
            this.configurationChanged();
        }
    }
    get hours() {
        if (this.type === ClockTypes.alarm) {
            return this._biggerTimeElement;
        }
        return 0;
    }

    set minutes(minutes) {
        if (this.type === ClockTypes.alarm) {
            this._smallerTimeElement = minutes;
        } else if (this.type === ClockTypes.timer) {
            this._biggerTimeElement = minutes;
        }
        this.configurationChanged();
    }
    get minutes() {
        if (this.type === ClockTypes.alarm) {
            return this._smallerTimeElement;
        }
        if (this.type === ClockTypes.timer) {
            return this._biggerTimeElement;
        }
        return 0;
    }

    set seconds(seconds) {
        if (this.type === ClockTypes.timer) {
            this._smallerTimeElement = seconds;
            this.configurationChanged();
        }
    }
    get seconds() {
        if (this.type === ClockTypes.timer) {
            return this._smallerTimeElement;
        }
        return 0;
    }

    get isYoutubeLink() {
        return ClockConfiguration.isYoutubeLink(this._audioLink);
    }

    toString() {
        return [this.type,this.audioLink,this.shortAudioTitle,this.title,this._biggerTimeElement,this._smallerTimeElement].join(CLOCK_CONFIG_PROPERTY_DELIMITER);
    }
}

ClockConfiguration.fromString = function (urlString) {
    const splitStr = urlString.split(CLOCK_CONFIG_PROPERTY_DELIMITER);
    return new ClockConfiguration(splitStr[0], splitStr[1], splitStr[2], splitStr[3], splitStr[4], splitStr[5]);
}

ClockConfiguration.isYoutubeLink = function (urlString) {
    return urlString.match(/http(s?):\/\/www\.youtube\.com\/watch\?v=(.{11})/)
}