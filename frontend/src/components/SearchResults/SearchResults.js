import React from "react";
//import styles from './SearchResults.module.css'
import SingleResult from "../SingleResult";

function SearchResults({ results, networkError }) {
	if (networkError) {
		return (
			<div className='container mx-auto p-5'>
				<p>Network error, please try again later.</p>
			</div>
		);
	}

	if (results?.length === 0) {
		return (
			<div className='container mx-auto p-5'>
				<p>No results found.</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-5'>
			{/* <div className='grid gap-4 grid-cols-3 grid-rows-3 sm:grid-cols-1'> */}
			<div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
				{results?.map((result, index) => (
					<SingleResult
						key={result.episode_id + result.line_number}
						episodeId={result.episode_id}
						content={result.content}
						lineNumber={result.line_number}
						timeCode={result.timecode}
						selectedShow={result.show}
					/>
				))}
			</div>
		</div>
	);
}

export default SearchResults;
