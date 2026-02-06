import React from "react";
import DotPulse from "../DotPulse/DotPulse";
import { shows } from "../../utils/data";

function SearchField({
	runSearch,
	selectedShow,
	setSelectedShow,
	loading,
	setResult,
}) {
	const [searchTerm, setSearchTerm] = React.useState("");
	return (
		<form
			className='flex flex-col md:flex-row items-center justify-center gap-2 p-4'
			onSubmit={(event) => {
				event.preventDefault();
				runSearch(selectedShow, searchTerm);
			}}
		>
			<label className='text-brand-brown font-semibold'>
				Pick a show:
				<select
					value={selectedShow}
					className='w-full md:w-72 h-11 bg-gray-100 border-3 border-brand-brown p-2 ml-0 md:ml-2'
					onChange={(event) => {
						setSelectedShow(event.target.value);
						setResult(null);
						setSearchTerm("");
					}}
				>
					{shows.map((show, index) => {
						return (
							<option value={show.id} key={index}>
								{show.name}
							</option>
						);
					})}
				</select>
			</label>

			<input
				className='w-full md:w-80 h-11 bg-gray-100 border-3 border-brand-brown p-2'
				value={searchTerm}
				placeholder='What did they say again?'
				onChange={(event) => setSearchTerm(event.target.value)}
			/>
			<button className='h-11 px-6 bg-brand-brown text-white font-bold border-3 border-brand-brown shadow-brutal hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all'>
				{loading ? <DotPulse text={"..."} /> : "Search"}
			</button>
		</form>
	);
}

export default SearchField;
