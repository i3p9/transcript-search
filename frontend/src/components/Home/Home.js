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

	//TODO Secrect imple,ent via env
	function runSearch(selectedShow, searchTerm) {
		//console.log(process.env.REACT_APP_AUTH_TOKEN)
		setLoading(true);
		const limit = 12;
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `${apiUrl}/arg?show_key=${selectedShow}&q=${searchTerm}&limit=${limit}`,
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
				className='text-3xl font-bold pt-2'
				style={{
					font: "Mona Sans",
					fontWeight: "800",
					fontStretch: "125%",
				}}
			>
				Moment Seeker
			</h1>
			<SearchField
				runSearch={runSearch}
				selectedShow={selectedShow}
				setSelectedShow={setSelectedShow}
				loading={loading}
			/>
			{loading ? (
				<Skeleton selectedShow={selectedShow} />
			) : (
				<SearchResults results={result} networkError={networkError} />
			)}
		</div>
	);
}

export default Home;
