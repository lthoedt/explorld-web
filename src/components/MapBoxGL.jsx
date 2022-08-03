import React, { useRef, useEffect, useState } from "react";

// API DOCS : https://docs.mapbox.com/mapbox-gl-js/api/
import mapboxgl from "mapbox-gl";

// API DOCS : https://github.com/mapbox/mapbox-gl-geocoder
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { useDispatch, useSelector } from "react-redux";

import { JOURNEY_ACTIONS } from "../actions/journeyActions";

import Coordinate from "../classes/Coordinate";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const MapBoxStyles = require("../constants/mapBoxStyles.json");

const TOKEN =
	"pk.eyJ1IjoiZHV0Y2h0YSIsImEiOiJja2ZhM2I4eDUwcnZpMnRsYzEwbHVzNWc0In0.qU9vsZyaP2Aw5uUe7MMEDQ";

mapboxgl.accessToken = TOKEN;

export default function MapBoxGL() {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.journey);

	const journeyCoords = state.journey.map((point) =>
		point.coordinates.toArray()
	);

	const mapContainer = useRef(null);
	const map = useRef(null);

	// TODO: LOAD last location
	const [lng, setLng] = useState(5.88);
	const [lat, setLat] = useState(51.98);

	const journeyData = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: journeyCoords,
		},
	};

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: MapBoxStyles.outdoors,
			center: [lng, lat],
			zoom: 13,
			projection: "globe",
		});

		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
			showUserHeading: true,
		});

		map.current.addControl(geolocate);

		map.current.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl,
				marker: false,
			})
		);

		geolocate.on("geolocate", function (e) {
			const newLocationTravelDistanceTreshhold = 100;

			const lat = e.coords.latitude;
			const lon = e.coords.longitude;

			dispatch({
				type: JOURNEY_ACTIONS.addPoint,
				coordinate: new Coordinate(lat, lon),
				heading: e.coords.heading,
			});
		});

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
				exaggeration: 1,
			});

			map.current.addSource("journey", {
				type: "geojson",
				data: journeyData,
			});

			map.current.addLayer({
				id: "journey",
				type: "line",
				source: "journey",
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": "#888",
					"line-width": 8,
				},
			});
		}

		waitForMap();
	});

	useEffect(() => {
		if (!map.current || !map.current.getSource("journey")) return; // wait for map to initialize

		map.current.getSource("journey").setData(journeyData);

		// setInterval(() => {
		// 	console.log('asd')
		// }, 2000)
	});

	return (
		<div>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
