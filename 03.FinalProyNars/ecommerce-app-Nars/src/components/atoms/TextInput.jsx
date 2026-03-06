import "./TextInput.css";

/**
 * TextInput Atom
 * Sigue el patrón de Atomic Design como un Atom.
 */
export function TextInput({ label, id, error, className = "", ...props }) {
  const containerClass = `form-field ${error ? "form-field--error" : ""} ${className}`.trim();

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className="form-input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="form-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}