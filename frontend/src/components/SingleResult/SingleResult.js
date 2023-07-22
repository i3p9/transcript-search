import React, { useEffect } from 'react';
import { getEpisodeData } from '../../utils/episodeData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../Constants'

const apiUrl = config.url.API_URL
const token = process.env.REACT_APP_AUTH_TOKEN

function SingleResult({ episodeId, content, timeCode, lineNumber, selectedShow }) {
  const [isHovering, setIsHovering] = React.useState(false)
  const [contextLine, setContextLine] = React.useState(null)
  const [showContext, setShowContext] = React.useState(false)
  const [currentEpisodeInfo, setCurrentEpisodeInfo] = React.useState()

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  //TODO Secrect imple,ent via env
  function getContext(episodeId, lineNumber) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/${selectedShow}/context?episode_id=${episodeId}&line_number=${lineNumber}&auth=${token}`,
      headers: {}
    };
    axios.request(config)
      .then((response) => {
        console.log('search succ??');
        console.log(response.data)
        setContextLine(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  useEffect(() => {
    getEpisodeData(episodeId, selectedShow)
      .then((episodeData) => {
        setCurrentEpisodeInfo(episodeData);
        console.log(episodeData.name);
      })
      .catch((error) => {
        console.log(error);
        // Handle errors here
      });
  }, []);

  console.log(currentEpisodeInfo)

  //const currentEpisodeInfos = getEpisodeData(episodeId, selectedShow)

  const navigate = useNavigate();

  const handleClick = () => {
    const url = `/${selectedShow}/episode/${episodeId}?highlight=${lineNumber}`;
    navigate(url);
  };

  return (
    <div className='border-solid border-2 grid' style={{ borderColor: "#4F200D" }}>
      {/* <div>Line: {lineNumber}</div> */}
      { }
      {showContext ? (
        contextLine?.map((line, index) => (
          <div
            key={index}
            style={{ backgroundColor: "#FFD93D", color: "#4F200D", border: "0px solid #4F200D", fontStyle: "italic" }}
          >{line.content}</div>
        ))
      ) : (
        <div
          className='p-1'
          style={{ backgroundColor: "#FFD93D", color: "#4F200D", border: "0px solid #4F200D", fontStyle: "italic", fontSize: "1.1rem" }}
        >{content}</div>
      )}
      <div
        style={{ color: "rgb(79, 32, 13, 0.9)", fontStretch: "125%", fontWeight: "500" }}
      >{episodeId} ({currentEpisodeInfo?.name})</div>
      <div
        style={{ color: "rgb(79, 32, 13, 0.8)", fontStretch: "80%" }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >{timeCode} {isHovering && `| Line: ${lineNumber}`}</div>
      <div className='p-1 grid grid-cols-2'>
        <button
          // className='text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 rounded-lg text-sm px-5 py-1 mr-2 mb-2 focus:outline-none'
          style={{ backgroundColor: "#4F200D", color: "white", borderRight: "2px solid #F6F1E9", fontStretch: "125%", fontWeight: "600" }}
          onClick={handleClick}
        >Go to Episode</button>
        <button
          // className='text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 rounded-lg text-sm px-5 py-1 mr-2 mb-2 focus:outline-none'
          style={{ backgroundColor: "#4F200D", color: "white", borderLeft: "2px solid #F6F1E9", fontStretch: "125%", fontWeight: "600" }}
          onClick={(event) => {
            event.preventDefault()
            if (showContext === true) {
              setShowContext(false)
            } else {
              setShowContext(true)
              getContext(episodeId, lineNumber)
            }
          }}
        >{showContext ? "Hide Context" : "Show Context"}</button>
      </div>
    </div>
  );
}

export default SingleResult;
