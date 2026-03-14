import "./TextInput.css";

export function TextInput({ label, id, error, ...props }) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input 
        id={id} 
        className="form-input" 
        data-testid={props["data-testid"] || `input-${id}`}
        {...props} 
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}