import React, { useRef, useEffect, useState } from "react";

// API DOCS : https://docs.mapbox.com/mapbox-gl-js/api/
import mapboxgl from "mapbox-gl";

// API DOCS : https://github.com/mapbox/mapbox-gl-geocoder
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { useDispatch, useSelector } from "react-redux";

import {
	JOURNEY_ACTIONS,
	JOURNEY_STATUS,
	loadJourney,
	MAP_STATUS,
	syncPoints,
} from "../actions/journeyActions";

import Coordinate from "../classes/Coordinate";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const MapBoxStyles = require("../constants/mapBoxStyles.json");

const TOKEN =
	"pk.eyJ1IjoiZHV0Y2h0YSIsImEiOiJja2ZhM2I4eDUwcnZpMnRsYzEwbHVzNWc0In0.qU9vsZyaP2Aw5uUe7MMEDQ";

mapboxgl.accessToken = TOKEN;

export default function MapBoxGL() {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.journey);

	if (state.status == JOURNEY_STATUS.UNLOADED) dispatch(loadJourney());

	const mapContainer = useRef(null);
	const map = useRef(null);

	// TODO: LOAD last location
	const [lng, setLng] = useState(5.88);
	const [lat, setLat] = useState(51.98);

	const [oldJourneyAdded, setOldJourneyAdded] = useState(false);

	const [coords, setCoords] = useState([]);

	const updateCoordinatesFromJourney = () => {
		const currentJourney = state.currentJourney;
		const unsyncedJourney = state.unsyncedJourney;

		// currentJourney isnt fully in the coords
		// add the rest after the last stpot in.
		if (coords.length < currentJourney.length)
			for (let i = coords.length; i < currentJourney.length; i++)
				coords.push(currentJourney[i].coordinates.toArray());

		if (coords.length < currentJourney.length + unsyncedJourney.length)
			for (let i = coords.length - currentJourney.length; i < unsyncedJourney.length; i++)
				coords.push(unsyncedJourney[i].coordinates.toArray());
	}

	function refreshJourneySource() {
		if (!map.current || !map.current.getSource("journey")) return; // wait for map to initialize

		console.log("Map refreshed!");

		updateCoordinatesFromJourney();
		journeyData.geometry.coordinates = coords;

		map.current.getSource("journey").setData(journeyData);
	}

	function addSplitJourneyLayers() {
		if (state.mapStatus == MAP_STATUS.UNLOADED || oldJourneyAdded) return;

		const splitJourneys = state.journey;

		for (const [i, splitPoints] of splitJourneys.entries()) {
			map.current.addSource(`journey_${i}`, {
				type: "geojson",
				data: {
					type: "Feature",
					properties: {},
					geometry: {
						type: "LineString",
						coordinates: splitPoints.map((point) =>
							point.coordinates.toArray()
						),
					},
				},
			});

			map.current.addLayer({
				id: `journey_${i}`,
				type: "line",
				source: `journey_${i}`,
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": `#${Math.floor(Math.random() * 16777215).toString(16)}`,
					"line-width": 6,
				},
			});

		}
		
		setOldJourneyAdded(true);
	}

	const journeyData = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [...state.currentJourney, ...state.unsyncedJourney].map((point) =>
				point.coordinates.toArray()
			),
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

		// Explorer moved
		geolocate.on("geolocate", function (e) {
			const lat = e.coords.latitude;
			const lon = e.coords.longitude;

			dispatch({
				type: JOURNEY_ACTIONS.ADD_POINT,
				coordinate: new Coordinate(lat, lon),
				heading: e.coords.heading,
			});

			if (state.status != JOURNEY_STATUS.SYNCING) dispatch(syncPoints());
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

			map.current.addSource(`journey`, {
				type: "geojson",
				data: journeyData,
			});

			map.current.addLayer({
				id: `journey`,
				type: "line",
				source: `journey`,
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": `#00ff00`,
					"line-width": 6,
				},
			});

			dispatch({ type: JOURNEY_ACTIONS.MAP_LOADED });
		}

		waitForMap();
	});

	useEffect(() => {
		if (!map.current) return 
		
		addSplitJourneyLayers();
		refreshJourneySource();
	});

	return (
		<div>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
