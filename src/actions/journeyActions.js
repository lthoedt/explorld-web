import axios from "axios";
import { Point } from "mapbox-gl";
import URIs from "../constants/URIs.json";
import Pt from "../classes/Point";

export const JOURNEY_ACTIONS = {
	ADD_POINT: "ADD_POINT",
	SET_STATUS: "JOURNEY_STATUS_SET",
	POINTS_SYNCED: "POINTS_SYNCED",
	JOURNEY_LOADED: "JOURNEY_LOADED",
	MAP_LOADED: "MAP_LOADED",
};

export const JOURNEY_STATUS = {
	UNLOADED: "UNLOADED",
	LOADING_JOURNEY: "LOADING_JOURNEY",
	LOADED_JOURNEY: "LOADED_JOURNEY",
	SYNCING: "SYNCING",
	SYNCED: "SYNCED",
};

const explorerId = "123";

export const syncPoints = () => {
	return async (dispatch, getState) => {
		if (getState().journey.unsyncedJourney.length < 5) return; //TODO: network setting

		// set status syncing
		dispatch({
			type: JOURNEY_ACTIONS.SET_STATUS,
			status: JOURNEY_STATUS.SYNCING,
		});

		const pointsJSON = JSON.stringify(getState().journey.unsyncedJourney);

		// call to api
		const response = await axios.post(
			`${URIs.api}/explorer/${explorerId}/journey/sync`,
			pointsJSON,
			{ headers: { "content-type": "application/json" } }
		);

		dispatch({ type: JOURNEY_ACTIONS.POINTS_SYNCED });

		// set status synced
		dispatch({
			type: JOURNEY_ACTIONS.SET_STATUS,
			status: JOURNEY_STATUS.SYNCED,
		});
	};
};

export const loadJourney = () => {
	return async (dispatch, getState) => {
		if (getState().journey.status == JOURNEY_STATUS.LOADING_JOURNEY) return;

		dispatch({
			type: JOURNEY_ACTIONS.SET_STATUS,
			status: JOURNEY_STATUS.LOADING_JOURNEY,
		});

		const response = await axios.get(
			`${URIs.api}/explorer/${explorerId}/journey/sync`
		);

		if (response.status != 200)
			return dispatch({
				type: JOURNEY_ACTIONS.SET_STATUS,
				status: JOURNEY_STATUS.UNLOADED,
			});

		const journey = response.data.map((point) => Pt.fromJSON(point));	

		dispatch({
			type: JOURNEY_ACTIONS.JOURNEY_LOADED,
			journey: journey,
		});

		dispatch({
			type: JOURNEY_ACTIONS.SET_STATUS,
			status: JOURNEY_STATUS.LOADED_JOURNEY,
		});
	};
};
