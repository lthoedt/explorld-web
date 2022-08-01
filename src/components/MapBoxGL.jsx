import React, { useRef, useEffect, useState } from "react";

// API DOCS : https://docs.mapbox.com/mapbox-gl-js/api/
import mapboxgl from "mapbox-gl";

// API DOCS : https://github.com/mapbox/mapbox-gl-geocoder
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const MapBoxStyles = require("../constants/mapBoxStyles.json");

const TOKEN =
	"pk.eyJ1IjoiZHV0Y2h0YSIsImEiOiJja2ZhM2I4eDUwcnZpMnRsYzEwbHVzNWc0In0.qU9vsZyaP2Aw5uUe7MMEDQ";

mapboxgl.accessToken = TOKEN;

export default function MapBoxGL() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-70.9);
	const [lat, setLat] = useState(42.35);
	const [zoom, setZoom] = useState(9);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: MapBoxStyles["satelitte-streets"],
			center: [lng, lat],
			zoom: zoom,
			projection: "globe",
		});

		map.current.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
				showUserHeading: true,
			})
		);

		map.current.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl,
				marker: false,
			})
		);

		async function waitForMap() {
			await map.current.once("load");

			map.current.setFog({
				range: [0.5, 10],
				color: "#237aeb",
				"horizon-blend": 0.01,
				"high-color": "#6086e0",
				"space-color": "#000000",
				"star-intensity": 0.1,
			});

			// Add some 3D terrain
			map.current.addSource("mapbox-dem", {
				type: "raster-dem",
				url: "mapbox://mapbox.terrain-rgb",
				tileSize: 512,
				maxzoom: 14,
			});
			map.current.setTerrain({
				source: "mapbox-dem",
				exaggeration: 1.5,
			});
		}

		waitForMap();
	});

	useEffect(() => {
		if (!map.current) return; // wait for map to initialize
		map.current.on("move", () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});
	});

	return (
		<div>
			<div className="sidebar">
				Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
			</div>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
