import {getPreciseDistance} from "geolib";

// Beautify numeric distance value
export const convertDistance = (m) => {
    if (m) {
        const km = m / 1000;
        if (km < 0.5) return `${Math.round(m)} m`;
        else if (km > 9999) return '';
        else return `${Math.round(km)} km`;
    }
    else return '';
};

// Calculates the distance between two geo coordinates
export const getDistance = (start, end) => {
    return getPreciseDistance(
        { latitude: start.lat, longitude: start.lng },
        { latitude: end.lat, longitude:end.lng }
    );
};
