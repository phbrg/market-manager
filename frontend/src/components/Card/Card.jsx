import { NavLink } from 'react-router-dom'

import './Card.css'

export const Card = ({ elements, edit }) => {
  return (
    <div className='Card'>
      {
        elements && elements.map((element, key) => (
          <p className='element' key={key}>{element}</p>
        ))
      }
      <NavLink className='link' to={edit}>Edit</NavLink>
    </div>
  )
}
