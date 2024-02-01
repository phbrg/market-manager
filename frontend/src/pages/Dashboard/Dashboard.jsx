import { useEffect } from 'react';

import Cookies from 'js-cookie';

import useApi from '../../hooks/useApi'

import './Dashboard.css'

const Dashboard = async () => {
  const isLogged = Cookies.get('logged') || null;

  if(!isLogged || isLogged == '0') {
    window.location.href = '/login';
  }

  const { data, error, loading, fetchData } = useApi(`${import.meta.env.VITE_API_URL}/products`, 'GET');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(data, error);

  return (
    <section className='Dashboard'>
      <h1>Hello world</h1>
    </section>
  )
}

export default Dashboard