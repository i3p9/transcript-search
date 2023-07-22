import React from 'react'
import axios from 'axios'
import SearchResults from '../SearchResults'
import SearchField from '../SearchField'
import Skeleton from '../Skeleton'
import { config } from '../../Constants'

const apiUrl = config.url.API_URL;

function Home() {
  const [selectedShow, setSelectedShow] = React.useState('sunny')
  const [result, setResult] = React.useState()
  const [loading, setLoading] = React.useState(false)

  //TODO Secrect imple,ent via env
  function runSearch(selectedShow, searchTerm) {
    console.log(apiUrl)
    setLoading(true)
    const limit = 15
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/${selectedShow}/search?q=${searchTerm}&limit=${limit}&auth=ELq2zTogAx0k6g4dTkj4XXiBek0In5i9`,
      headers: {}
    };
    axios.request(config)
      .then((response) => {
        //console.log('search succ??');
        setLoading(false)
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <SearchField runSearch={runSearch} selectedShow={selectedShow} setSelectedShow={setSelectedShow} />
      {loading ? (
        <Skeleton />
      ) : (
        <SearchResults results={result} selectedShow={selectedShow} />
      )}
    </div>
  );
}

export default Home;
