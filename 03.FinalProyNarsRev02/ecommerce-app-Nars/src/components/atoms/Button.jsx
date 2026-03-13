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
  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
}