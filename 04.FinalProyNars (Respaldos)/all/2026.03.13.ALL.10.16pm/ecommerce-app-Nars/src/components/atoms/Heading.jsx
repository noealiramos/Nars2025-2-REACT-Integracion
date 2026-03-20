import "./Heading.css";

export function Heading({ level = 1, children, align = "left", className = "" }) {
  const Tag = `h${level}`;
  const alignClass =
    align === "center" ? "heading-center" : align === "right" ? "heading-right" : "";
  const levelClass = `heading-${level}`;
  const finalClass = ["heading", levelClass, alignClass, className]
    .filter(Boolean)
    .join(" ");
  return <Tag className={finalClass}>{children}</Tag>;
}