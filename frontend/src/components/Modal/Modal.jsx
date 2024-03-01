import { Button } from '../Button/Button'

import './Modal.css'

export const Modal = ({ title, body, btnText, handle, handleCloseModal }) => {
  return (
    <div className='Modal'>
      <h1>{title}</h1>
      <p>{body}</p>
      <div>
        <Button text={btnText} handle={handle} />
        <Button text='Cancel' handle={handleCloseModal} />
      </div>
    </div>
  )
}
