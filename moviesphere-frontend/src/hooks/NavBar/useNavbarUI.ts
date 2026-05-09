import { useEffect, useState } from "react";

export function useNavbarUI() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return { open, toggleDrawer: () => setOpen((p) => !p) };
}
