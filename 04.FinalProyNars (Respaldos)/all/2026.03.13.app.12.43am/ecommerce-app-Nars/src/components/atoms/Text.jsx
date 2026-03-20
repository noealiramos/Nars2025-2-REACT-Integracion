import "./Text.css";

export function Text({ children, className = "" }) {
  return <p className={["text-body", className].filter(Boolean).join(" ")}>{children}</p>;
}