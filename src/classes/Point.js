import Coordinate from "./Coordinate";

export default class Point {
	id;
	coordinates;
	heading;
	time;

	constructor(id, coordinates, heading, time) {
		this.id = id;
		this.coordinates = coordinates;
		this.heading = heading;
		this.time = time;
	}

	static fromJSON = (json) =>
		new Point(
			json.id,
			Coordinate.fromJSON(json.coordinates),
			json.heading,
			json.time
		);
}
