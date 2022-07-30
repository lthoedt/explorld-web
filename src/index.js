import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import * as ReactRedux from "react-redux";
import { mainReducer } from "./reducers/reducers";

import "./pages/main.css";
// require('dotenv').config()

const logger = (store) => (next) => (action) => {
	console.log("💥 dispatching 💥", action);
	let result = next(action);
	console.log("next state", store.getState());
	return result;
};

export const theStore = createStore(
	mainReducer,
	applyMiddleware(logger, thunk)
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<ReactRedux.Provider store={theStore}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				// 404
				<Route
					path="*"
					element={
						<main style={{ padding: "1rem" }}>
							<p>There's nothing here!</p>
						</main>
					}
				/>
			</Routes>{" "}
		</BrowserRouter>
	</ReactRedux.Provider>
);
