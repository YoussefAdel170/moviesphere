// src/components/ui/logo/Logo.tsx
import { FiFilm } from "react-icons/fi";
import "./Logo.scss";

type Props = {
  onClick?: () => void;
};

export default function Logo({ onClick }: Props) {
  return (
    <div className="logo" onClick={onClick} role="button">
      <div className="logo__icon">
        <FiFilm />
      </div>

      <span className="logo__text">
        Movie<span>Sphere</span>
      </span>
    </div>
  );
}