import React from "react";
import MapBoxGL from "./components/MapBoxGL";
import 'mapbox-gl/dist/mapbox-gl.css';
import SidePanel from "./components/SidePanel";

export default function App() {
	return (
		<div className="Main">
			<SidePanel></SidePanel>
			<MapBoxGL></MapBoxGL>
		</div>
	);
}
