import { useState, useEffect } from 'react'

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
    if(data) {
      window.location.href = '/';
    }
  }, [data])

  return (
    <section className='Login'>
      {
        loading && <div className='loader'></div>
      }
      <form onSubmit={handleSubmit}>
        <Input text='Login:' type='text' name='login' placeholder='Your login' handle={handleOnChange} />
        <Input text='Password:' type='password' name='password' placeholder='Your password' handle={handleOnChange} />
        {
          error && <p className="form-error">{error}</p>
        }
        <Button text='Login'/>
      </form>
    </section>
  )
}
