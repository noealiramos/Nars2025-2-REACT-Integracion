import "./Text.css";

export function Text({ children, size = "md", weight = "normal", className = "" }) {
  const sizeClass = `text-${size}`;
  const weightClass = `text-${weight}`;
  const finalClass = ["text-body", sizeClass, weightClass, className].filter(Boolean).join(" ");
  return <p className={finalClass}>{children}</p>;
}