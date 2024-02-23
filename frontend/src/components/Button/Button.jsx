import './Button.css'

export const Button = ({ text, handle = null }) => {
  return (
    <button onClick={handle ? handle : null}>{text}</button>
  )
}
