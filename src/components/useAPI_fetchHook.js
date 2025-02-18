import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch API data
const useApiData = (url) => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // useEffect to fetch data only once when the URL is set
  useEffect(() => {
    if (!url) return; // Do nothing if the URL is not provided

    const fetchData = async () => {
      try {
        setIsLoaded(false);
        setError(null);
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData(); // Trigger the data fetching process
  }, [url]); // Only retrun when the `url` changes

  return { data, isLoaded, error };
};

export default useApiData;
