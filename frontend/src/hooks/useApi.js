import Cookies from 'js-cookie';

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
      };

      const token = Cookies.get('token') || null;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let response;
      if (body) {
        response = await fetch(url, {
          method,
          body: JSON.stringify(body),
          headers,
        });
      } else {
        response = await fetch(url, { method, headers });
      }

      const responseData = await response.json();
      
      if(responseData.token) {
        Cookies.set('token', responseData.token, { expires: 7 }); // a week
      }

      if (!response.ok) {
        setError(responseData.message);
      } else {
        setData(responseData.message);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useApi;