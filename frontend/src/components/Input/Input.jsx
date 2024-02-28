import './Input.css'

export const Input = ({ text, type, name, placeholder, handle = null, required = null, id = null}) => {
  return (
    <label>
      {text}
      <input type={type} name={name} placeholder={placeholder} required={required ? true : false} onChange={handle ? handle : null} id={id ? id : null} />
    </label>
  )
}
