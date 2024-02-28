import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Input } from '../../components/Input/Input'
import { Button } from '../../components/Button/Button'

import useApi from '../../hooks/useApi'

import './Login.css'

export const Login = () => {
  const [user, setUser] = useState({});
  const { data, error, loading, fetchData } = useApi(`${import.meta.env.VITE_API_URL}/login`, 'POST', user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetchData();
  }

  const handleOnChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    if(data) window.location.href = '/';
    if(error) toast(`❗ ${error}`);
  }, [data, error])

  return (
    <section className='Login'>
      {
        loading && <div className='loader'></div>
      }
      <form onSubmit={handleSubmit}>
        <Input text='Login:' type='text' name='login' placeholder='Your login' required={true} handle={handleOnChange} />
        <Input text='Password:' type='password' name='password' placeholder='Your password' required={true} handle={handleOnChange} />
        <Button text='Login'/>
      </form>
    </section>
  )
}
