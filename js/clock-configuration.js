class ClockConfiguration {
    constructor(audioLink, title, minutes, seconds) {
        this._audioLink = audioLink || "audio/true.mp3";
        this.isDefaultAudioLink = !audioLink;
        this._title = title || "";
        this._minutes = minutes || "";
        this._seconds = seconds || "";
    }

    configurationChanged() {
        const event = new CustomEvent("clock-config-changed", this);
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


    set title(title) {
        this._title = title;
        this.configurationChanged();

    }
    get title() {
        return this._title
    }

    set minutes(minutes) {
        this._minutes = minutes;
        this.configurationChanged();

    }
    get minutes() {
        return this._minutes
    }

    set seconds(seconds) {
        this._seconds = seconds;
        this.configurationChanged();

    }
    get seconds() {
        return this._seconds
    }

    toString() {
        return `${this.audioLink}|:|${this.title}|:|${this.minutes}|:|${this.seconds}`;
    }
}

ClockConfiguration.fromString = function (urlString) {
    const splitStr = urlString.split("|:|");
    return new ClockConfiguration(splitStr[0], splitStr[1], splitStr[2], splitStr[3]);
}

