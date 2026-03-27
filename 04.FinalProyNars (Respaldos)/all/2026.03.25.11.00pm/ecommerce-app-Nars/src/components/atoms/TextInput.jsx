import "./TextInput.css";

export function TextInput({ label, id, error, ...props }) {
  const testId = props["data-testid"] || `input-${id}`;
  const dataCy = props["data-cy"] || testId;

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
        data-testid={testId}
        data-cy={dataCy}
        {...props} 
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
