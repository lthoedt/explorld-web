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
		// set status syncing
		dispatch({ type: JOURNEY_ACTIONS.SET_STATUS, status: "syncing" });

		const pointsJSON = JSON.stringify(getState().journey.unsyncedJourney);

		console.log(pointsJSON);

		// call to api
		const response = await axios.post(
			`${URIs.api}/points/${explorerId}/sync`,
			pointsJSON,
			{ headers: { "content-type": "application/json" } }
		);

		console.log(response);

		dispatch({ type: JOURNEY_ACTIONS.POINTS_SYNCED });

		// set status synced
		dispatch({ type: JOURNEY_ACTIONS.SET_STATUS, status: "synced" });
	};
};
