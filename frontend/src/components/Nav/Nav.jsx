import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';

import { Button } from '../Button/Button'

import useApi from '../../hooks/useApi'

import './Nav.css'

export const Nav = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    return (
      <></>
    )
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
   if(!user) userFetch();
  }, []);

  useEffect(() => {
    if(userGet) setUser(userGet);
  }, [userGet])

  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if(user) {
      if(user.role == 'MANAGER' || user.role == 'BOSS') {
        setAdmin(true);
      }
    }
  }, [user]);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  }
  
  return (
    <nav>
      {
        user && <>
          <NavLink to='/'>dashboard</NavLink>
          {
            admin && <>
            <NavLink to='/logs'>logs</NavLink>
            <NavLink to='/employees'>employees</NavLink>
            </>
          }
          <Button handle={handleLogout} text='logout'/>
        </>
      }
    </nav>
  )
}
