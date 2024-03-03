import './Button.css'

export const Button = ({ text, handle = null, value = null, className = null, btnStyle }) => {
  switch(btnStyle) {
    case 'success':
      btnStyle = 'button-success'
      break; 
    case 'warning':
      btnStyle = 'button-warning'
      break; 
    case 'delete':
      btnStyle = 'button-delete'
      break;
    case 'form':
      btnStyle = 'button-form'
      break;
    default:
      btnStyle = 'button-default'
  }

  return (
    <button id={btnStyle} className={className ? className : null} value={value ? value : null} onClick={handle ? handle : null}>{text}</button>
  )
}
