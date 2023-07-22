import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getEpisodeData } from '../../utils/episodeData';
import { config } from '../../Constants'

const baseUrl = config.url.BASE_URL;

const Transcript = () => {
  const { selectedShow, episodeId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const variable = params.get('highlight');

  const [transcriptData, setTranscriptData] = useState(null)
  const [episodeData, setEpisodeData] = useState()
  console.log('we are in transcsirpt page somehow?')
  console.log(variable);
  //const episodeData = getEpisodeData(episodeId)

  useEffect(() => {
    getEpisodeData(episodeId, selectedShow)
      .then((episodeData) => {
        setEpisodeData(episodeData);
        console.log(episodeData.name);
      })
      .catch((error) => {
        console.log(error);
        // Handle errors here
      });
  }, []);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        // Load the JSON file and parse it into an object
        const response = await fetch(`${baseUrl}/json/${selectedShow}/${episodeId}.json`);
        const data = await response.json();
        setTranscriptData(data);
      } catch (error) {
        console.error('Error loading transcript data:', error);
      }
    };
    fetchTranscriptData();
  }, [selectedShow, episodeId])

  useEffect(() => {
    const element = document.getElementById('highlighed-line');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  }, [transcriptData])

  return (
    <div className='px-40 container md mx-auto'>
      <h1 className="text-3xl font-bold underline py-2">Transcript of {episodeId}</h1>
      <h2>{episodeData?.name}</h2>
      <h2>Episode overview: {episodeData?.overview}</h2>
      {transcriptData?.map((line, index) => {
        if (line.line_number === parseInt(variable)) {
          return ( //highlighted line
            <div className='pt-2 border border-double rounded-md w-70 bg-slate-300' key={index} id='highlighed-line'>
              <p className='text-red-400'>{line.line_number} : {line.timecode}</p>
              <div className='text-lg text-red-400'>{line.content}</div>
            </div>
          )

        } else { //regular transcript
          return (
            <div className='flex justify-items-start content-evenly gap-4 border rounded-sm' key={index}>
              <div
                className='text-gray-700 pl-4 basis-1/1 bg-emerald-300'
                style={{ flexBasis: "300px" }}
              >{line.line_number} : {line.timecode}</div>
              <div
                className='text-lg pl-8 basis-1/8'
                style={{ marginLeft: "none", backgroundColor: "pink" }}
              >{line.content}</div>
            </div>
          )
        }
      })}

    </div>
  );
};

export default Transcript;
