import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

import Input from '../../components/Input/Input'

import useApi from '../../hooks/useApi'

import './Login.css'

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const { data, error, loading, fetchData } = useApi(`${import.meta.env.VITE_API_URL}/login`, 'POST', user);

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetchData();
  }

  useEffect(() => {
    if(data) {
      Cookies.set('logged', true, { expires: 1 });
      navigate('/teste');
    }
  }, [data, error]);


  return (
    <section>
      {
        loading && <p>Loading...</p>
      }
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input type='text' text='Login' name='login' placeholder='Your login' handleOnChange={handleChange} />
        <Input type='password' text='Password' name='password' placeholder='Your password' handleOnChange={handleChange} />
        {
          error && <p>{error}</p>
        }
        <button>Sign in</button>
      </form>
    </section>
  )
}

export default Login