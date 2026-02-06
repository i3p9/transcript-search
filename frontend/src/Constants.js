const prod = {
	url: {
		API_URL: "https://transcript-search-api.fhm.workers.dev",
		BASE_URL: window.location.origin,
	},
};
const dev = {
	url: {
		API_URL: "http://localhost:8888",
		BASE_URL: window.location.origin,
	},
};
export const config =
	process.env.NODE_ENV === "development" ? dev : prod;
