import { useState } from 'react';

const useApi = (url, method, body = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      let response;
      if(body) {
        response = await fetch(url, { method, body: JSON.stringify(body), headers });
      } else {
        response = await fetch(url, { method, headers });
      }
      const data = await response.json();

      if(!response.ok) {
        setError(data.message);
      } else {
        setData(data.message);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useApi