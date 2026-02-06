import React from "react";
import SingleResult from "../SingleResult";
import { shows } from "../../utils/data";

function SearchResults({ results, networkError, selectedShow }) {
	const showInfo = shows.find((s) => s.id === selectedShow);
	const accentColor = showInfo?.color || "#FFD93D";

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
			{results && (
				<div className='mb-4 flex items-center justify-between'>
					<p
						className='text-brand-brown font-bold text-lg'
						style={{ fontStretch: "125%" }}
					>
						Results from <span className='italic'>{showInfo?.name}</span>
					</p>
					{showInfo?.logo ? (
						<img
							src={showInfo.logo}
							alt={showInfo.name}
							className='h-8 shrink-0'
						/>
					) : (
						<div
							className='w-4 h-4 border-2 border-brand-brown shrink-0'
							style={{ backgroundColor: accentColor }}
						/>
					)}
				</div>
			)}
			<div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start'>
				{results?.map((result, index) => (
					<SingleResult
						key={result.episode_id + result.line_number}
						episodeId={result.episode_id}
						content={result.content}
						lineNumber={result.line_number}
						timeCode={result.timecode}
						selectedShow={result.show}
						accentColor={accentColor}
					/>
				))}
			</div>
		</div>
	);
}

export default SearchResults;
