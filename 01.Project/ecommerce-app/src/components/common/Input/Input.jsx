import "./Input.css";

export default function Input({
  id,
  label,
  name,
  value,
  type = "text",
  placeholder = "",
  onChange,
  onBlur,
  error,
  showError,
  autoComplete,
}) {
  const errorId = `${id}-error`;
  const invalid = Boolean(showError && error);
  const className = "";

  return (
    <div className={`input-group ${className}`} data-cy={`${id}-group`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        data-cy={id}
        className={`formInput ${invalid ? "isInvalid" : ""}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={invalid ? "true" : "false"}
        aria-describedby={invalid ? errorId : undefined}
      />
      {invalid ? (
        <p className="formError" id={errorId} data-cy={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
