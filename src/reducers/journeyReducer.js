import Point from "../classes/Point";
import Coordinate from "../classes/Coordinate";

import { JOURNEY_ACTIONS, JOURNEY_STATUS, MAP_STATUS } from "../actions/journeyActions";

const initialJourneyState = {
	status: JOURNEY_STATUS.UNLOADED,
	mapStatus: MAP_STATUS.UNLOADED,
	journey: [
		// new Point(
		// 	"1",
		// 	new Coordinate(51.983488, 5.880724),
		// 	0,
		// 	Date.now() - 3550
		// ),
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
	currentJourney: [],
	unsyncedJourney: []
};

export default (state = initialJourneyState, action) => {
	switch (action.type) {
		case JOURNEY_ACTIONS.ADD_POINT:
			const distanceMovedThreshhold = 5; // TODO: changable by data/performance setting

			let lastLocation = state.unsyncedJourney[state.unsyncedJourney.length - 1];

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
				"1",
				action.coordinate,
				action.heading,
				Date.now()
			);

			return { ...state, unsyncedJourney: [...state.unsyncedJourney, point] };

		case JOURNEY_ACTIONS.SET_STATUS:
			return { ...state, status: action.status }

		case JOURNEY_ACTIONS.POINTS_SYNCED:
			// move synced points to journey
			return {...state, currentJourney: [...state.currentJourney, ...state.unsyncedJourney], unsyncedJourney: []}

		case JOURNEY_ACTIONS.JOURNEY_LOADED:
			return {...state, journey: action.journey};

		case JOURNEY_ACTIONS.MAP_LOADED:
			return {...state, mapStatus: MAP_STATUS.LOADED};
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
