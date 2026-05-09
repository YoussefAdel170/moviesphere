// components/ui/logo/Logo.tsx
import { FiFilm } from "react-icons/fi";
import "./Logo.scss";
import TooltipComponent from "../../../helper/tooltip/TooltipComponent";

type Props = {
  logo_aria?: string;
  onClearSearch: () => void; // receive the clear function from parent
};

export default function Logo({ logo_aria, onClearSearch }: Props) {
  return (
    <TooltipComponent title={logo_aria || ""} position="bottom">
      <div className="logo" onClick={onClearSearch} role="button">
        <div className="logo__icon">
          <FiFilm />
        </div>
        <span className="logo__text">
          Movie<span>Sphere</span>
        </span>
      </div>
    </TooltipComponent>
  );
}
