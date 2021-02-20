// Get distance between two geo coords
export const calcCrow = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // m
    const dLat = rad(lat2-lat1);
    const dLon = rad(lon2-lon1);
    lat1 = rad(lat1);
    lat2 = rad(lat2);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// Get angle between two geo coords relative to north
export const bearing = (lat1, lon1, lat2, lon2) => {
    lat1 = rad(lat1);
    lon1 = rad(lon1);
    lat2 = rad(lat2);
    lon2 = rad(lon2);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const res = deg(Math.atan2(y, x));
    return (res + 360) % 360;
};

// Rotate a point in space by given angle
export const rotatePoint = (point, angle) => {
    angle = (angle + 360) % 360
    //console.log('rotation angle', angle)
    const x = point[0], y = point[1], z = point[2];
    const newCoords = [0, y, 0];

    newCoords[0] = x * Math.cos(rad(angle)) - z * Math.sin(rad(angle));
    newCoords[2] = x * Math.sin(rad(angle)) + z * Math.cos(rad(angle));

    return newCoords;
};

// Converts degrees to radians
export const rad = (deg) => {
    return deg * Math.PI / 180;
};

// Converts radians to degrees
export const deg = (rad) => {
    return rad * 180 / Math.PI;
};
