import './Input.css'

export const Input = ({ text, type, name, placeholder, handle, required = null}) => {
  return (
    <label>
      {text}
      <input type={type} name={name} placeholder={placeholder} required={required ? true : false} onChange={handle} />
    </label>
  )
}
