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
    //eslint-disable-next-line
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

  // TODO: redo design with mobile thinking
  return (
    <div className='px-5 sm:px-3 md:px-10 container md mx-auto py-2'>
      <div
        className='py-0'
        style={{ border: "2px solid #4F200D", marginBottom: "10px" }}
      >
        <h1
          className="text-3xl font-bold py-2"
          style={{ fontStretch: "80%" }}
        >
          Transcript of {episodeId}</h1>
        <h2
          className='text-2xl'
          style={{ fontWeight: 600, fontStretch: "90%" }}
        >
          {episodeData?.name}
        </h2>
        <h2
          style={{ fontWeight: 400, fontStretch: "110%", fontStyle: "italic" }}
        >
          Episode overview: {episodeData?.overview}
        </h2>
      </div>
      {transcriptData?.map((line, index) => {
        if (line.line_number === parseInt(variable)) {
          return ( //highlighted line
            <div
              className='flex flex-col md:flex-row justify-items-start content-evenly rounded-md'
              style={{ border: "4px dashed #FF8400" }}
              key={index}
              id='highlighed-line'
            >
              <div
                className='text-gray-700 pl-2 basis-1/4 md:basis-1/1'
                style={{ color: "#4F200D", backgroundColor: "#FFD93D" }}
              >{line.line_number} : {line.timecode}</div>
              <div
                className='text-lg pl-2 basis-3/4 md:basis-1/8'
                style={{ marginLeft: "none", backgroundColor: "rgba(79, 32, 13, 0.1)", color: "#4F200D" }}
              >{line.content}</div>
            </div>
          )

        } else { //regular transcript
          return (
            <div className='flex flex-col md:flex-row justify-items-start content-evenly border rounded-md' key={index}>
              <div
                className='text-gray-700 pl-2 basis-1/4 md:basis-1/1'
                style={{ color: "#4F200D", backgroundColor: "#FFD93D" }}
              >{line.line_number} : {line.timecode}</div>
              <div
                className='text-lg pl-2 basis-3/4 md:basis-1/8'
                style={{ marginLeft: "none", backgroundColor: "rgba(79, 32, 13, 0.1)", color: "#4F200D" }}
              >{line.content}</div>
            </div>
          )
        }
      })}

    </div>
  );
};

export default Transcript;
