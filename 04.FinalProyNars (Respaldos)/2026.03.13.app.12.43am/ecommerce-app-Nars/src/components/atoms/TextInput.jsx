import "./TextInput.css";

export function TextInput({ label, id, error, ...props }) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input id={id} className="form-input" {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}