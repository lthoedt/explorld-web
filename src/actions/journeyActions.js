import axios from "axios";
import URIs from "../constants/URIs.json";

export const JOURNEY_ACTIONS = {
	ADD_POINT: "ADD_POINT",
	SET_STATUS: "JOURNEY_STATUS_SET",
	POINTS_SYNCED: "POINTS_SYNCED",
};

const explorerId = "123";

export const syncPoints = () => {
	return async (dispatch, getState) => {
		if (getState().journey.unsyncedJourney.length < 5) return; //TODO: network setting

		// set status syncing
		dispatch({ type: JOURNEY_ACTIONS.SET_STATUS, status: "syncing" });

		const pointsJSON = JSON.stringify(getState().journey.unsyncedJourney);

		// call to api
		const response = await axios.post(
			`${URIs.api}/explorer/${explorerId}/journey/sync`,
			pointsJSON,
			{ headers: { "content-type": "application/json" } }
		);

		dispatch({ type: JOURNEY_ACTIONS.POINTS_SYNCED });

		// set status synced
		dispatch({ type: JOURNEY_ACTIONS.SET_STATUS, status: "synced" });
	};
};
