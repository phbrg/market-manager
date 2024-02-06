import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';

import Input from '../../components/Input/Input'

import useApi from '../../hooks/useApi'

import './Login.css'

const Login = () => {
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
      Cookies.set('logged', 1, { expires: 1 });

      async function teste() {
        await fetch(`${import.meta.env.VITE_API_URL}/products`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include', })
          .then((data) => {
            console.log(JSON.stringify(data));
          }).catch((err) => console.log(err))
      }

      teste();

      // window.location.href = '/';
    }
  }, [data, error]);


  return (
    <section className='Login'>
      {
        loading && <div className="loader"></div>
      }
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <Input type='text' text='Login' name='login' placeholder='Your login' handleOnChange={handleChange} required={true} />
        <Input type='password' text='Password' name='password' placeholder='Your password' handleOnChange={handleChange} required={true} />
        {
          error && <p className='form-error'>{error}</p>
        }
        <button>Sign in</button>
      </form>
    </section>
  )
}

export default Login