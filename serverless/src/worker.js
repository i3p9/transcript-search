const allowedOrigins = ['https://momentseeker.vercel.app', 'https://momentseeker.ffaisal.com'];

function getCorsHeaders(request) {
	const origin = request.headers.get('Origin');
	const isAllowed = allowedOrigins.includes(origin) || (origin && new URL(origin).hostname === 'localhost');
	return {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': isAllowed ? origin : '',
		'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Max-Age': '86400',
	};
}

function jsonResponse(data, status = 200, request) {
	return new Response(JSON.stringify(data), { status, headers: getCorsHeaders(request) });
}

async function searchv2(db, showKey, query, limit) {
	const shows = showKey.split('+').map((s) => s.trim());
	const placeholders = shows.map(() => '?').join(', ');

	const sql = `
		SELECT t.show, t.episode_id, t.line_number, t.timecode, t.content
		FROM transcripts_fts fts
		JOIN transcripts t ON t.id = fts.rowid
		WHERE transcripts_fts MATCH ?
		AND t.show IN (${placeholders})
		ORDER BY rank
		LIMIT ?
	`;

	const params = [query, ...shows, parseInt(limit)];
	const { results } = await db
		.prepare(sql)
		.bind(...params)
		.all();
	return { documents: results };
}

async function getContext(db, showKey, episodeId, contextLines) {
	const placeholders = contextLines.map(() => '?').join(', ');

	const sql = `
		SELECT show, episode_id, line_number, timecode, content
		FROM transcripts
		WHERE show = ? AND episode_id = ? AND line_number IN (${placeholders})
	`;

	const params = [showKey, episodeId, ...contextLines];
	const { results } = await db
		.prepare(sql)
		.bind(...params)
		.all();
	return { documents: results };
}

export default {
	async fetch(request, env) {
		const { pathname, searchParams } = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: getCorsHeaders(request) });
		}

		if (pathname.includes('arg')) {
			const query = searchParams.get('q');
			const limit = searchParams.get('limit');
			const auth = request.headers.get('X-Auth-Token');
			const showKey = searchParams.get('show_key');

			if (!auth || auth !== env.ACCEPTED_KEY) {
				return jsonResponse({ error: 'wrong params / auth / searchv2' }, 401, request);
			}
			if (!query || !limit || !showKey) {
				return jsonResponse({ error: 'missing required params' }, 400, request);
			}

			const result = await searchv2(env.DB, showKey, query, limit);
			return jsonResponse(result, 200, request);
		} else if (pathname.includes('context')) {
			const episodeId = searchParams.get('episode_id');
			const lineNumber = searchParams.get('line_number');
			const auth = request.headers.get('X-Auth-Token');
			const showKey = searchParams.get('show_key');

			if (!auth || auth !== env.ACCEPTED_KEY) {
				return jsonResponse({ error: 'auth error' }, 401, request);
			}
			if (!episodeId || !lineNumber || !showKey) {
				return jsonResponse({ error: 'wrong params' }, 400, request);
			}

			const numberLine = parseInt(lineNumber);
			const contextLines = numberLine > 1 ? [numberLine - 1, numberLine, numberLine + 1] : [numberLine, numberLine + 1];

			const result = await getContext(env.DB, showKey, episodeId, contextLines);
			return jsonResponse(result, 200, request);
		}

		return jsonResponse({ error: 'invalid request' }, 404, request);
	},
};
