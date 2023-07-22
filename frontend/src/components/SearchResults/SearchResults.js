import React from 'react';
//import styles from './SearchResults.module.css'
import SingleResult from '../SingleResult'

function SearchResults({ results, selectedShow }) {
  console.log(results);
  return (
    <div className='container mx-auto p-5'>
      <div className='grid gap-4 grid-cols-3 grid-rows-3'>
        {results?.map((result, index) => (
          <SingleResult
            key={result.episode_id + result.line_number}
            episodeId={result.episode_id}
            content={result.content}
            lineNumber={result.line_number}
            timeCode={result.timecode}
            selectedShow={selectedShow}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
