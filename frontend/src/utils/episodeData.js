import axios from 'axios';
import { config } from '../Constants'

const baseUrl = config.url.BASE_URL;


// export function getEpisodeData(episode_id, selectedShow) {
//     //return episodeData[episode_id]
//     // const fetchEpisodeData = async (show, episode_id) => {
//     //     try {
//     //         // Load the JSON file and parse it into an object
//     //         const response = await fetch(`http://localhost:3000/episode_data/${show}.json`);
//     //         const data = await response.json();
//     //         return data[episode_id]
//     //     } catch (error) {
//     //         console.error('Error loading episode data:', error);
//     //     }
//     // };

//     const config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `http://localhost:3000/episode_data/${selectedShow}.json`,
//         headers: {}
//     };

//     axios.request(config)
//         .then((response) => {
//             console.log('episodeData succ??');
//             response = response.data
//             //console.log(response[episode_id]);
//             return response[episode_id]
//         })
//         .catch((error) => {
//             console.log(error);
//         });

// }

export function getEpisodeData(episode_id, selectedShow) {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${baseUrl}/episode_data/${selectedShow}.json`,
        headers: {}
    };

    return new Promise((resolve, reject) => {
        axios.request(config)
            .then((response) => {
                console.log('episodeData succ??');
                response = response.data;
                //console.log(response[episode_id]);
                resolve(response[episode_id]);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}
