class ClockConfiguration {
    constructor(audioLink, shortAudioTitle, title, hours, minutes, seconds) {
        this._audioLink = audioLink || "../../audio/true.mp3";
        this._shortAudioTitle = shortAudioTitle || "";
        this.isDefaultAudioLink = !audioLink;
        this._title = title || "";
        this._hours = hours || "";
        this._minutes = minutes || "";
        this._seconds = seconds || "";
    }

    configurationChanged() {
        const event = new CustomEvent("clock-config-changed", {detail: this});
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
        this._hours = hours;
        this.configurationChanged();
    }
    get hours() {
        return this._hours;
    }

    set minutes(minutes) {
        this._minutes = minutes;
        this.configurationChanged();
    }
    get minutes() {
        return this._minutes;
    }

    set seconds(seconds) {
        this._seconds = seconds;
        this.configurationChanged();
    }
    get seconds() {
        return this._seconds;
    }

    set isYoutubeLink (ignored) {}
    get isYoutubeLink() {
        return ClockConfiguration.isYoutubeLink(this._audioLink);
    }

    toString() {
        return `${this.audioLink}|:|${this.shortAudioTitle}|:|${this.title}|:|${this.hours}|:|${this.minutes}|:|${this.seconds}`;
    }
}

ClockConfiguration.fromString = function (urlString) {
    const splitStr = urlString.split("|:|");
    return new ClockConfiguration(splitStr[0], splitStr[1], splitStr[2], splitStr[3], splitStr[4], splitStr[5]);
}

ClockConfiguration.isYoutubeLink = function (urlString) {
    return urlString.match(/http(s?):\/\/www\.youtube\.com\/watch\?v=(.{11})/)
}