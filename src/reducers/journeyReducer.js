import Point from "../classes/Point";
import Coordinate from "../classes/Coordinate";

import { JOURNEY_ACTIONS } from "../actions/journeyActions";

const initialJourneyState = {
	journey: [
		new Point(
			"1",
			new Coordinate(51.983488, 5.880724),
			0,
			Date.now() - 3550
		),
		// new Point(
		// 	"1",
		// 	new Coordinate(51.98368, 5.882087),
		// 	0,
		// 	Date.now() - 3600
		// ),
		// new Point(
		// 	"1",
		// 	new Coordinate(51.984056, 5.892321),
		// 	0,
		// 	Date.now() - 3500
		// ),
	], // Point
};

export default (state = initialJourneyState, action) => {
	switch (action.type) {
		case JOURNEY_ACTIONS.addPoint:
			const distanceMovedThreshhold = 5; // TODO: changable by data/performance setting

			let lastLocation = state.journey[state.journey.length - 1];

			if (lastLocation) {
				lastLocation = lastLocation.coordinates;
				const distanceMoved = getDistanceFromLatLonInM(
					lastLocation.lat,
					lastLocation.lon,
					action.coordinate.lat,
					action.coordinate.lon
				);
				if (distanceMoved - distanceMovedThreshhold < 0) return state; // move atleast threshold before new upload
			}

			const point = new Point(
				1,
				action.coordinate,
				action.heading,
				Date.now()
			);

			return { ...state, journey: [...state.journey, point] };
		default:
			return state;
	}
};

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d * 1000;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
