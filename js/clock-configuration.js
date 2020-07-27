class ClockConfiguration {
    constructor(audioLink, title, minutes, seconds) {
        this._audioLink = audioLink || "audio/true.mp3";
        this.isDefaultAudioLink = !audioLink;
        this.title = title || "";
        this.minutes = minutes || "";
        this.seconds = seconds || "";
    }

    set audioLink(audioLink) {
        this.isDefaultAudioLink = false;
        this._audioLink = audioLink;
    }
    get audioLink() {
        return this._audioLink;
    }
}