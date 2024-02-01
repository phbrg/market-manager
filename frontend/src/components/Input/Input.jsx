import './Input.css'

const Input = ({ type, text, name, placeholder, handleOnChange, value, required }) => {
  return (
    <label htmlFor={name}>
      &ensp;{text}
      <input required={required} type={type} name={name} id={name} placeholder={placeholder} onChange={handleOnChange} value={value} />
    </label>
  )
}

export default Input