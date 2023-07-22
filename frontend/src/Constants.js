const prod = {
    url: {
        API_URL: 'https://transcript-search.onrender.com',
        BASE_URL: 'https://findthemoment.vercel.app'
    }
};
const dev = {
    url: {
        API_URL: 'http://localhost:8000',
        BASE_URL: 'http://localhost:3000'
    }
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
