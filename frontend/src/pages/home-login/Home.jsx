import useApi from '../../hooks/useApi'
import { useState, useEffect } from 'react'
import './Home.css'

const Home = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { data: apiData, error: apiError } = useApi(import.meta.env.VITE_API_URL, 'POST', { login, password });

  useEffect(() => {
    if (apiData) {
      setData(apiData);
    }
    if (apiError) {
      setError(apiError);
    }
  }, [apiData, apiError]);

  const handleForm = (e) => {
    e.preventDefault();

    if(!login || !password || login.length === 0 || password.length === 0) {
      setError('Invalid credentials');
    }

    if(error) {
      setError(error);
    }

    if(data) {
      alert(data);
    }
  }

  return (
    <div className='Home'>
      <form onSubmit={handleForm}>
        <h1>Log in to your account</h1>
        <div className='inputs'>
          <fieldset  htmlFor="login">
            <legend>Login</legend>
            <input name='login' type="text" placeholder='Your login' required onChange={(e) => { setLogin(e.target.value) }} value={login} />
          </fieldset >
          <fieldset  htmlFor="password">
            <legend>Password</legend>
            <input name='password' type="password" placeholder='Your password' required onChange={(e) => { setPassword(e.target.value) }} value={password} />
          </fieldset >
        </div>
        <div className='button-error'>
          {
            error && <p className='error'>{error.message}</p>
          }
          <button>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Home