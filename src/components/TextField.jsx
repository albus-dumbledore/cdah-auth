function TextField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  autoComplete,
  as = 'input',
  options = [],
  rows = 4
}) {
  const inputId = `field-${name}`
  const hasError = !!error
  const inputClassName = `text-field__input${hasError ? ' text-field__input--error' : ''}`

  const renderInput = () => {
    if (as === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`text-field__textarea${hasError ? ' text-field__input--error' : ''}`}
        />
      )
    }

    if (as === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`text-field__select${hasError ? ' text-field__input--error' : ''}`}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={inputClassName}
      />
    )
  }

  return (
    <div className="text-field">
      {label && (
        <label htmlFor={inputId} className="text-field__label">
          {label}
          {required && <span style={{ color: '#ef5350', marginLeft: 4 }}>*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <span className="text-field__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

export default TextField
