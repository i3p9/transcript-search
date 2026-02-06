import React, { useEffect } from 'react';
import { getEpisodeData } from '../../utils/episodeData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../Constants'
import DotPulse from '../DotPulse/DotPulse';

const apiUrl = config.url.API_URL
const token = process.env.REACT_APP_AUTH_TOKEN

function SingleResult({ episodeId, content, timeCode, lineNumber, selectedShow }) {
  const [isHovering, setIsHovering] = React.useState(false)
  const [contextLine, setContextLine] = React.useState(null)
  const [showContext, setShowContext] = React.useState(false)
  const [currentEpisodeInfo, setCurrentEpisodeInfo] = React.useState()
  const [contextIsLoading, setContextIsLoading] = React.useState(false)

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  //TODO Secrect imple,ent via env
  function getContext(episodeId, lineNumber) {
    setContextIsLoading(true)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/context?show_key=${selectedShow}&episode_id=${episodeId}&line_number=${lineNumber}`,
      headers: { "X-Auth-Token": token }
    };
    axios.request(config)
      .then((response) => {
        //setting data.documents to accomodate cf worker
        setContextIsLoading(false)
        setContextLine(response.data.documents);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  useEffect(() => {
    getEpisodeData(episodeId, selectedShow)
      .then((episodeData) => {
        setCurrentEpisodeInfo(episodeData);
      })
      .catch((error) => {
        console.log(error);
      });
    //eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    const url = `/${selectedShow}/episode/${episodeId}?highlight=${lineNumber}`;
    navigate(url);
  };

  return (
    <div className='border-3 border-brand-brown shadow-brutal'>
      {showContext ? (
        contextIsLoading ? (
          <div className='bg-brand-yellow text-brand-brown italic p-3'>
            {content}...
          </div>
        ) : (
          contextLine?.map((line, index) => (
            <div
              key={index}
              className='bg-brand-yellow text-brand-brown italic p-3 border-b border-brand-brown/20 last:border-b-0'
            >{line.content}</div>
          )))
      ) : (
        <div className='bg-brand-yellow text-brand-brown italic p-3'>
          {content}
        </div>
      )}
      <div
        className='px-3 py-1 text-brand-brown/90 font-medium'
        style={{ fontStretch: "125%" }}
      >{episodeId} ({currentEpisodeInfo?.name})</div>
      <div
        className='px-3 pb-1 text-brand-brown/70 text-sm'
        style={{ fontStretch: "80%" }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >{timeCode} {isHovering && `| Line: ${lineNumber}`}</div>
      <div className='grid grid-cols-2 border-t-3 border-brand-brown'>
        <button
          className='bg-brand-brown text-white font-semibold py-2 border-r border-brand-cream/30 hover:bg-brand-brown/90 transition-colors'
          style={{ fontStretch: "125%" }}
          onClick={handleClick}
        >Go to Episode</button>
        <button
          className='bg-brand-brown text-white font-semibold py-2 hover:bg-brand-brown/90 transition-colors'
          style={{ fontStretch: "125%" }}
          onClick={(event) => {
            event.preventDefault()
            if (showContext === true) {
              setShowContext(false)
            } else {
              setShowContext(true)
              getContext(episodeId, lineNumber)
            }
          }}
        >
          {contextIsLoading ? <DotPulse text={"..."} /> : showContext ? "Hide Context" : "Show Context"}
        </button>
      </div>
    </div>
  );
}

export default SingleResult;
