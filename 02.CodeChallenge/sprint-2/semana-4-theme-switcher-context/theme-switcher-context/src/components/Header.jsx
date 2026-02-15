import BotonSwitch from "./BotonSwitch";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="logo">🌗</span>
          <span className="title">Mi App</span>
        </div>

        <BotonSwitch />
      </div>
    </header>
  );
}
