import './Input.css'

export const Input = ({ text, type, name, placeholder, handle}) => {
  return (
    <label>
      {text}
      <input type={type} name={name} placeholder={placeholder} required onChange={handle} />
    </label>
  )
}
