import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner'

import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

import useApi from '../../hooks/useApi'

import './User.css'

export const User = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { id } = useParams();
  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/admin/users/id/${id}`, 'GET');
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState({});
  const { data: editGet, error: editError, loading: editLoading, fetchData: editFetch } = useApi(`${import.meta.env.VITE_API_URL}/admin/edituser/${id}`, 'PUT', newUser);
  const { data: deleteGet, error: deleteError, loading: deleteLoading, fetchData: deleteFetch } = useApi(`${import.meta.env.VITE_API_URL}/admin/deleteuser/${id}`, 'DELETE');

  useEffect(() => {
    if(!user) userFetch();
  }, [])

  useEffect(() => {
    if(userGet) setUser(userGet);
    if(userError) window.location.href = '/error';
  }, [userGet, userError]);

  const handleOnChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await editFetch();
  }

  useEffect(() => {
    if(editGet) window.location.href = '/employees'
    if(editError) toast(`❗ ${editError}`);
  }, [editGet, editError]);

  const handleDeleteUser = async () => {
    // modal confirmation
    await deleteFetch();
  }

  useEffect(() => {
    if(deleteGet) window.location.href = '/employees';
    if(deleteError) toast(`❗ ${deleteError}`);
  }, [deleteGet, deleteError]);

  return (
    <section className='User'>
      {
        userLoading || editLoading || deleteLoading && <div className="loader"></div>
      }
      {
        user && <>
          <h1>ID: {user.id}</h1>
          <form onSubmit={handleSubmit}>
            <Input text='Name:' type='text' name='name' placeholder={user.name} handle={handleOnChange} />
            <Input text='Login:' type='text' name='login' placeholder={user.login} handle={handleOnChange} />
            <Input text='Password:' type='password' name='password' placeholder='Password' handle={handleOnChange} />
            <Input text='Confirm Password:' type='password' name='confirmPassword' placeholder='Password' handle={handleOnChange} />
            <Input text='Role:' type='text' name='role' placeholder='EMPLOYEE, MANAGER, BOSS' handle={handleOnChange} />
            <Input text='Admin Password:' type='password' name='adminPassword' placeholder='Password' handle={handleOnChange} />
            <Button text='Edit user'/>
          </form>
          <Button text='Delete user' handle={handleDeleteUser} />
        </>
      }
    </section>
  )
}
