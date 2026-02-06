import React from "react";
import axios from "axios";
import SearchResults from "../SearchResults";
import SearchField from "../SearchField";
import Skeleton from "../Skeleton";
import { config } from "../../Constants";

const apiUrl = config.url.API_URL;
const token = process.env.REACT_APP_AUTH_TOKEN;

function Home() {
	const [selectedShow, setSelectedShow] = React.useState("sunny");
	const [result, setResult] = React.useState();
	const [loading, setLoading] = React.useState(false);
	const [networkError, setNetworkError] = React.useState(false);
	const [hasSearched, setHasSearched] = React.useState(false);

	//TODO Secrect imple,ent via env
	function runSearch(selectedShow, searchTerm) {
		//console.log(process.env.REACT_APP_AUTH_TOKEN)
		setLoading(true);
		setHasSearched(true);
		setResult(null);
		const limit = 12;
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `${apiUrl}/arg?show_key=${encodeURIComponent(selectedShow)}&q=${encodeURIComponent(searchTerm)}&limit=${limit}`,
			headers: { "X-Auth-Token": token },
		};
		axios
			.request(config)
			.then((response) => {
				setLoading(false);
				setNetworkError(false);
				//setting data.documents to accomodate cf worker
				setResult(response.data.documents);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				setNetworkError(true);
			});
	}

	return (
		<div className='container mx-auto'>
			<h1
				className='text-5xl md:text-6xl font-black pt-6 pb-2 text-brand-brown'
				style={{ fontStretch: "125%" }}
			>
				Moment Seeker
			</h1>
			{!hasSearched && (
				<div className='pb-4'>
					<p className='text-lg text-brand-brown/80 font-semibold'>
						Search through <span className='italic'>my</span> favorite
						shows
					</p>
					<p className='text-sm text-brand-brown/60'>
						Type a quote. Find the episode. Scratch that annoying
						itch.
					</p>
				</div>
			)}
			<SearchField
				runSearch={runSearch}
				selectedShow={selectedShow}
				setSelectedShow={setSelectedShow}
				loading={loading}
				setResult={setResult}
			/>
			{loading ? (
				<Skeleton selectedShow={selectedShow} />
			) : (
				<SearchResults
					results={result}
					networkError={networkError}
					selectedShow={selectedShow}
				/>
			)}
		</div>
	);
}

export default Home;
