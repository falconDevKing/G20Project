// src/hooks/useFont.ts
import { useEffect, useState } from "react";

type FontKey = "garamond" | "inter";

export const useFont = (initial: FontKey = "garamond") => {
  const [font, setFont] = useState<FontKey>(() => (localStorage.getItem("app-font") as FontKey) || initial);

  useEffect(() => {
    document.documentElement.setAttribute("data-font", font);
    localStorage.setItem("app-font", font);
  }, [font]);

  return { font, setFont };
};
