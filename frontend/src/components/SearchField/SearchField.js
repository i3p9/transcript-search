import React from 'react';
import styles from './SearchField.module.css';
import { clsx } from 'clsx';

function SearchField({ runSearch, selectedShow, setSelectedShow }) {
  const BarStyle = { width: "20rem", background: "#F0F0F0", border: "2px solid #4F200D", padding: "0.5rem" };
  const selectStyle = { width: "15rem", height: "44px", background: "#F0F0F0", border: "2px solid #4F200D", padding: "0.5rem", marginRight: "10px", marginLeft: "10px" };

  const [searchTerm, setSearchTerm] = React.useState("")
  return (
    <form
      className="search-form p-2"
      onSubmit={(event) => {
        event.preventDefault();
        runSearch(selectedShow, searchTerm)
      }}
    >
      <label>Pick a show:
        <select
          // className='mb-2'
          value={selectedShow}
          style={selectStyle}
          key="select-show"
          onChange={event => {
            setSelectedShow(event.target.value)
          }}
        >
          <option value="sunny">It's Always Sunny in Philadelphia</option>
          <option value="theoffice_us">The Office (US)</option>
          <option value="brooklyn99">Brooklyn Nine-Nine</option>
        </select>
      </label>

      <input
        style={BarStyle}
        key="search-bar"
        value={searchTerm}
        // placeholder={"Search for sunny episodes"}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button
        className={clsx((styles.searchButton), 'p-1.5 m-1')}
      >
        Search
      </button>
    </form>
  );
}

export default SearchField;