import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getEpisodeData } from '../../utils/episodeData';
import { config } from '../../Constants'
import { shows } from '../../utils/data';

const baseUrl = config.url.BASE_URL;

const Transcript = () => {
  const { selectedShow, episodeId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const variable = params.get('highlight');

  const [transcriptData, setTranscriptData] = useState(null)
  const [episodeData, setEpisodeData] = useState()
  const showInfo = shows.find(show => show.id === selectedShow)
  const navigate = useNavigate();

  useEffect(() => {
    getEpisodeData(episodeId, selectedShow)
      .then((episodeData) => {
        setEpisodeData(episodeData);
      })
      .catch((error) => {
        console.log(error);
      });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
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
    <div className='px-4 sm:px-3 md:px-10 container mx-auto py-2 mb-10'>
      <button
        onClick={() => navigate('/')}
        className='mb-3 px-4 py-2 bg-brand-brown text-white font-bold border-3 border-brand-brown shadow-brutal hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all'
      >
        &larr; Back to Search
      </button>
      <div className='border-3 border-brand-brown p-4 md:p-6 mb-4 flex items-start justify-between gap-4'>
        <div>
          <h1
            className='text-3xl font-black text-brand-brown pb-1'
            style={{ fontStretch: "125%" }}
          >
            {showInfo?.name} - {episodeId}
          </h1>
          <p
            className='text-2xl text-brand-brown'
            style={{ fontWeight: 600, fontStretch: "90%" }}
          >
            {episodeData?.name}
          </p>
          <p
            className='text-brand-brown/80 italic pt-1'
            style={{ fontStretch: "110%" }}
          >
            Episode overview: {episodeData?.overview}
          </p>
        </div>
        {showInfo?.logo && (
          <img
            src={showInfo.logo}
            alt={showInfo.name}
            className='h-12 md:h-16 shrink-0'
          />
        )}
      </div>
      {transcriptData?.map((line, index) => {
        const isHighlighted = line.line_number === parseInt(variable);
        const isOdd = index % 2 === 1;

        if (isHighlighted) {
          return (
            <div
              className='flex flex-col md:flex-row border-3 border-brand-orange my-1'
              key={index}
              id='highlighed-line'
            >
              <div className='md:w-48 shrink-0 px-3 py-2 font-mono text-xs text-brand-brown bg-brand-yellow'>
                {line.line_number} : {line.timecode}
              </div>
              <div className='flex-1 px-3 py-2 font-medium text-lg text-brand-brown bg-brand-yellow/30'>
                {line.content}
              </div>
            </div>
          )
        } else {
          return (
            <div
              className={`flex flex-col md:flex-row border-b border-brand-brown/10 ${isOdd ? 'bg-brand-brown/5' : ''}`}
              key={index}
            >
              <div className='md:w-48 shrink-0 px-3 py-1 font-mono text-xs text-brand-brown/50'>
                {line.line_number} : {line.timecode}
              </div>
              <div className='flex-1 px-3 py-1 text-brand-brown'>
                {line.content}
              </div>
            </div>
          )
        }
      })}
    </div>
  );
};

export default Transcript;
