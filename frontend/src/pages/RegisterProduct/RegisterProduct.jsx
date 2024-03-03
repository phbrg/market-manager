import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner'

import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

import useApi from '../../hooks/useApi'

import './RegisterProduct.css'

export const RegisterProduct = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({});
  const { data: updateGet, error: updateError, loading: updateLoading, fetchData: updateFetch } = useApi(`${import.meta.env.VITE_API_URL}/registerproduct`, 'POST', product);

  useEffect(() => {
    if(!user) userFetch();
  }, []);

  useEffect(() => {
    if(userGet) setUser(userGet); 
  }, [userGet]);

  useEffect(() => {
    if(userError) toast(<p className='toast'>❗ {userError}</p>);
    if(updateError) toast(<p className='toast'>❗ {updateError}</p>);
  }, [userError, updateError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateFetch();
  }

  const handleOnChange = (e) => {
    setProduct({...product, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if(updateGet) window.location.href = '/';
  }, [updateGet]);

  return (
    <section className='RegisterProduct'>
      {
        userLoading || updateLoading && <div className="loader"></div>
      }
      <h1>Register product</h1>
      <form onSubmit={handleSubmit}>
        <Input text='Name:' type='text' name='name' placeholder='Name' handle={handleOnChange} />
        <Input text='Price:' type='number' name='price' placeholder='29.99' handle={handleOnChange} />
        <Input text='Amount:' type='number' name='amount' placeholder='99' handle={handleOnChange} />
        <Input text='Expiration:' type='date' name='expiration' placeholder='expiration' handle={handleOnChange} />
        <Button btnStyle='form' text='Register product'/>
      </form>
    </section>
  )
}
