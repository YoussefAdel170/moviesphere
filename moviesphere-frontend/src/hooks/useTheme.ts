import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

    // 🔥 update favicon dynamically
    const favicon = document.getElementById("favicon") as HTMLLinkElement;

    if (favicon) {
      favicon.href =
        theme === "dark"
          ? "/favicon-light.png"
          : "/favicon-dark.png";
    }
  }, [theme]);

  return { theme, setTheme };
}