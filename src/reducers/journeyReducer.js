import Point from "../classes/Point";
import Coordinate from "../classes/Coordinate";

const initialJourneyState = {
	journey: [
        new Point(
            "1",
            new Coordinate(51.983488, 5.880724),
            0,
            Date.now() - 3550
        ),
		new Point(
			"1",
			new Coordinate(51.98368, 5.882087),
			0,
			Date.now() - 3600
		),
		new Point(
			"1",
			new Coordinate(51.984056, 5.892321),
			0,
			Date.now() - 3500
		),
	], // Point
};

export default (state = initialJourneyState, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
