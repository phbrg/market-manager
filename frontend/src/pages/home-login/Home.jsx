import Cookies from 'js-cookie';
import useApi from '../../hooks/useApi'
import { useState } from 'react'
import './Home.css'

const Home = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { data, error: apiError, loading, fetchData } = useApi('http://localhost:3001/login', 'POST', { login, password });

  const handleForm = async (e) => {
    e.preventDefault();

    if(!login || !password || login.length === 0 || password.length === 0) {
      setError('Invalid credentials');
      return;
    }

    await fetchData();

    if(apiError) {
      setError(apiError);
    } else {
      // redirect user
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