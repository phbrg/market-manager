import { NavLink } from 'react-router-dom';

import './NotFound.css'

export const NotFound = () => {
  return (
    <section className='NotFound'>
      <h1>404</h1>
      <h2>ERROR: <span>Page not found.</span></h2>
      <NavLink className='home' to='/'>Get back home</NavLink>
    </section>
  )
}
