async function searchv2(showKey, query, limit, mongoUrl, apiKey) {
	console.log('search v2')
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Request-Headers", "*");
	myHeaders.append("api-key", apiKey);

	var raw = JSON.stringify({
		"collection": "all",
		"database": "searchData",
		"dataSource": "transcripts",
		"pipeline": [
			{
				"$search": {
					"index": "lines",
					"compound": {
						"filter": [
							{
								"text": {
									"query": query,
									"path": "content"
								}
							}
						],
						"must": [
							{
								"text": {
									"query": showKey,
									"path": "show"
								}
							}
						]
					}
				}
			},
			{
				"$limit": parseInt(limit)
			}
		]
	});


	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	try {
		const response = await fetch(`${mongoUrl}/aggregate`, requestOptions);
		//const result = await response.json();
		return response.json();
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

async function search(series, query, limit, mongoUrl, apiKey) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Request-Headers", "*");
	myHeaders.append("api-key", apiKey);

	var raw = JSON.stringify({
		"collection": series,
		"database": "dev",
		"dataSource": "transcripts",
		"pipeline": [
			{
				"$search": {
					"index": "lines",
					"text": {
						"query": query,
						"path": {
							"wildcard": "*"
						}
					}
				}
			},
			{
				"$limit": parseInt(limit)
			}
		]
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	try {
		const response = await fetch(`${mongoUrl}/aggregate`, requestOptions);
		//const result = await response.json();
		return response.json();
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}


async function getContext(showKey, episodeId, context_lines, mongoUrl, apiKey) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Request-Headers", "*");
	myHeaders.append("api-key", apiKey);

	var raw = JSON.stringify({
		"collection": "all",
		"database": "searchData",
		"dataSource": "transcripts",
		"filter": {
			"show": showKey,
			"episode_id": episodeId,
			"line_number": {
				"$in": context_lines
			}
		}
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	try {
		const response = await fetch(`${mongoUrl}/find`, requestOptions);
		//const result = await response.json();
		return response.json();
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export default {
	async fetch(request, env, ctx) {
		const mongoUrl = await env.MONGO_URL;
		const apiKey = await env.API_KEY;

		const { pathname, searchParams } = new URL(request.url)

		const headers = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Max-Age": "86400",
		}

		//search call
		if (pathname.includes('search')) {
			const query = searchParams.get('q')
			const limit = searchParams.get('limit')
			const auth = searchParams.get('auth')
			//const showKey = searchParams.get('show_key')
			const series = pathname.split("/").filter((segment) => segment !== "")[0]

			//return new Response(env.API_KEY);

			if (auth && auth === env.ACCEPTED_KEY) {
				if (query && limit && series) {
					const result = await search(series, query, limit, mongoUrl, apiKey)
					return new Response(JSON.stringify(result), {
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Content-Type, Authorization",
							"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
							"Access-Control-Max-Age": "86400",
						},
					});
				}
			} else {
				return new Response("wrong params / auth / search v1", { headers: headers });
			}
		}
		//search v2
		else if (pathname.includes('arg')) {
			const query = searchParams.get('q')
			const limit = searchParams.get('limit')
			const auth = searchParams.get('auth')
			const showKey = searchParams.get('show_key')
			//const series = pathname.split("/").filter((segment) => segment !== "")[0]

			//return new Response(env.API_KEY);

			if (auth && auth === env.ACCEPTED_KEY) {
				if (query && limit && showKey) {
					const result = await searchv2(showKey, query, limit, mongoUrl, apiKey)
					return new Response(JSON.stringify(result), {
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Content-Type, Authorization",
							"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
							"Access-Control-Max-Age": "86400",
						},
					});
				}
			} else {
				return new Response("wrong params / auth / searchv2", { headers: headers });
			}
		}

		//context call
		else if (pathname.includes('context')) {
			const episodeId = searchParams.get('episode_id')
			const lineNumber = searchParams.get('line_number')
			const auth = searchParams.get('auth')
			const showKey = searchParams.get('show_key')
			//const series = pathname.split("/").filter((segment) => segment !== "")[0]
			let context_lines = [];

			if (lineNumber) {
				const numberLine = parseInt(lineNumber)
				if (numberLine > 1) {
					context_lines = [numberLine - 1, numberLine, numberLine + 1];
				} else {
					context_lines = [numberLine, numberLine + 1];
				}
			}

			if (auth && auth === env.ACCEPTED_KEY) {
				if (episodeId && lineNumber && auth) {
					const result = await getContext(showKey, episodeId, context_lines, mongoUrl, apiKey)
					return new Response(JSON.stringify(result), {
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Content-Type, Authorization",
							"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
							"Access-Control-Max-Age": "86400",
						},
					});

				}
			} else {
				return new Response(`auth error`, { headers: headers })
			}
			return new Response(`wrong params`, { headers: headers });
		}
		else {
			return new Response('invalid request', { headers: headers })
		}
	},
};

