import './Input.css'

const Input = ({ type, text, name, placeholder, handleOnChange, value }) => {
  return (
    <label htmlFor={name}>
      {text}
      <input type={type} name={name} id={name} placeholder={placeholder} onChange={handleOnChange} value={value} />
    </label>
  )
}

export default Input