import "./Button.css";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClass = "btn";
  const variantClass =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-primary";

  const finalClass = [baseClass, variantClass, className].filter(Boolean).join(" ");
  const testId = props["data-testid"] || `btn-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`;
  const dataCy = props["data-cy"] || testId;
  return (
    <button 
      className={finalClass} 
      data-testid={testId}
      data-cy={dataCy}
      {...props}
    >
      {children}
    </button>
  );
}
