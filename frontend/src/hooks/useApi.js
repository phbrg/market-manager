import { useState } from 'react';

const useApi = (url, method, body = null, token = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(url, { method, body: JSON.stringify(body), headers });
      const data = await response.json();
      if(!response.ok) {
        setError(data);
      } else {
        setData(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useApi