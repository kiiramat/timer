const CLOCK_CONFIG_DELIMITER = "||::||";

class UrlHandler {
    constructor() { }

    pushToUrl(clockConfigs) {
        location.hash = this.convertToUrl(clockConfigs);
    }

    pullFromUrl() {
        return this.convertFromUrl(location.hash);
    }

    convertToUrl(clockConfigs) {
        const joinedConfigStrings = clockConfigs.map((config) => {
            return config.toString();
        }).join(CLOCK_CONFIG_DELIMITER);

        //escape string for use in the url
        return "#" + encodeURIComponent(joinedConfigStrings);
    }

    convertFromUrl(hashFragment) {
        if (!hashFragment || hashFragment === "#") {
            return [];
        }
        const decodedFragment = decodeURIComponent(hashFragment).slice(1);
        return decodedFragment
            .split(CLOCK_CONFIG_DELIMITER)
            .map((stringConfig) => {
                return ClockConfiguration.fromString(stringConfig);
            });
    }
}

const URL_HANDLER = new UrlHandler();