import './Button.css'

export const Button = ({ text, handle = null, value = null, className = null }) => {
  return (
    <button className={className ? className : null} value={value ? value : null} onClick={handle ? handle : null}>{text}</button>
  )
}
