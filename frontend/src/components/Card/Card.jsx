import { NavLink } from 'react-router-dom'

import './Card.css'

export const Card = ({ elements, link }) => {
  return (
    <NavLink to={link} className='Card'>
      {
        elements && elements.map((element, key) => (
          <p className='element' key={key}>{element}</p>
        ))
      }
    </NavLink>
  )
}
