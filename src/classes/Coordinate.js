export default class Coordinate {
	lat;
	lon;

	constructor(lat, lon) {
		this.lat = lat;
		this.lon = lon;
	}

	toArray() {
		return [this.lon, this.lat];
	}

	static fromJSON = (json) => new Coordinate(json.lat, json.lon);
}
