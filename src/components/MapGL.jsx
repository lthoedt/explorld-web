import * as React from "react";
import Map from "react-map-gl";

const MapBoxStyles = require("../constants/mapBoxStyles.json");

export default function MapGL() {
	return (
		<Map
			mapboxAccessToken="pk.eyJ1IjoiZHV0Y2h0YSIsImEiOiJja2ZhM2I4eDUwcnZpMnRsYzEwbHVzNWc0In0.qU9vsZyaP2Aw5uUe7MMEDQ"
			initialViewState={{
				longitude: -100,
				latitude: 40,
				zoom: 3.5,
			}}
			style={{ width: "100vw", height: "100vh" }}
			mapStyle={MapBoxStyles.outdoors}
		/>
	);
}
