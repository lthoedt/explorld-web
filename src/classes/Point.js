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
}