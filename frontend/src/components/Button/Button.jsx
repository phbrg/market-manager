import './Button.css'

export const Button = ({ text, handle = null, value = null }) => {
  return (
    <button value={value ? value : null} onClick={handle ? handle : null}>{text}</button>
  )
}
