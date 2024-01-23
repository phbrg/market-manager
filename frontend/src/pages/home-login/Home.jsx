import useApi from '../../hooks/useApi'

import { useState } from 'react'

import './Home.css'

const Home = () => {

  const handleForm = (e) => {
    e.preventDefault();
  }

  return (
    <div className='Home'>
      <form on>
        <h1>Log in to your account</h1>
        <div>
          <fieldset  htmlFor="login">
            <legend>Login</legend>
            <input name='login' type="text" placeholder='Your login' />
          </fieldset >
          <fieldset  htmlFor="password">
            <legend>Password</legend>
            <input name='password' type="password" placeholder='Your password' />
          </fieldset >
        </div>
        <button>Login</button>
      </form>
    </div>
  )
}

export default Home