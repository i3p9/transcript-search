import React, { useEffect } from 'react';
import { getEpisodeData } from '../../utils/episodeData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../Constants'
import styles from './SingleResult.module.css'

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
      url: `${apiUrl}/context?show_key=${selectedShow}&episode_id=${episodeId}&line_number=${lineNumber}&auth=${token}`,
      headers: {}
    };
    axios.request(config)
      .then((response) => {
        console.log('search succ??');
        console.log(response.data.documents)
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
        console.log(episodeData.name);
      })
      .catch((error) => {
        console.log(error);
        // Handle errors here
      });
    //eslint-disable-next-line
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
      {showContext ? (
        contextIsLoading ? (
          <div
            className={`${styles.resultContentSingle} p-1`}
          >{content}...</div>
        ) : (
          contextLine?.map((line, index) => (
            <div
              key={index}
              className={styles.resultContentMultiple}
            >{line.content}</div>
          )))
      ) : (
        <div
          className={`${styles.resultContentSingle} p-1`}
        >{content}</div>
      )}
      <div
        className={styles.episodeName}
      >{episodeId} ({currentEpisodeInfo?.name})</div>
      <div
        className={styles.lineNumber}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >{timeCode} {isHovering && `| Line: ${lineNumber}`}</div>
      <div className='p-1 grid grid-cols-2'>
        <button
          className={styles.button}
          onClick={handleClick}
        >Go to Episode</button>
        <button
          className={styles.button}
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
          {showContext ? "Hide Context" : "Show Context"}
        </button>
      </div>
    </div>
  );
}

export default SingleResult;
