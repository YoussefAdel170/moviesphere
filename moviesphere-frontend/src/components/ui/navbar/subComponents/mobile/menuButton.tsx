import { FiMenu, FiX } from "react-icons/fi";

type Props = {
  toggleDrawer: () => void;
  open: boolean;
  menu_button_aria: string;
};

export default function MobileBurgerMenuButton({
  toggleDrawer,
  open,
  menu_button_aria,
}: Props) {
  return (
    <button
      className="navbar__mobile"
      onClick={toggleDrawer}
      aria-expanded={open}
      aria-label={menu_button_aria}
    >
      {open ? <FiX /> : <FiMenu />}
    </button>
  );
}
