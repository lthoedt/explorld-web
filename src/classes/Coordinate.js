export default class Coordinate {
    lat;
    lon;

    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
    }

    toArray() {
        return [this.lon, this.lat]
    }
}