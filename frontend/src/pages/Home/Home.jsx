import Cookies from 'js-cookie';
import { useState } from 'react';

import useApi from '../../hooks/useApi'

import './Home.css'

export const Home = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data, error, loading, fetchData } = useApi(`${import.meta.env.VITE_API_URL}/login`, 'GET');

  return (
    <section>
      <h1>Home</h1>
    </section>
  )
}
