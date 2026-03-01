import { createContext, useContext, useState, useCallback } from "react"

const themes = {
  pink: {
    gradient1: "#7E1A57",
    gradient2: "#54113C",
    gradient3: "#350E48",
    blob1: "rgba(126, 26, 87, 0.6)",
    blob2: "rgba(84, 17, 60, 0.5)",
    blob3: "rgba(53, 14, 72, 0.5)",
    blob4: "rgba(160, 40, 100, 0.4)",
    blob5: "rgba(100, 30, 140, 0.4)",
    name: "pink",
  },
  blue: {
    gradient1: "#1a3a5c",
    gradient2: "#0f2744",
    gradient3: "#0a1628",
    blob1: "rgba(30, 80, 160, 0.6)",
    blob2: "rgba(20, 60, 130, 0.5)",
    blob3: "rgba(50, 100, 180, 0.5)",
    blob4: "rgba(40, 90, 200, 0.4)",
    blob5: "rgba(60, 120, 200, 0.4)",
    name: "blue",
  },
  green: {
    gradient1: "#1a5c3a",
    gradient2: "#0f4427",
    gradient3: "#0a2816",
    blob1: "rgba(30, 160, 80, 0.6)",
    blob2: "rgba(20, 130, 60, 0.5)",
    blob3: "rgba(50, 180, 100, 0.5)",
    blob4: "rgba(40, 200, 90, 0.4)",
    blob5: "rgba(60, 200, 120, 0.4)",
    name: "green",
  },
  orange: {
    gradient1: "#8B4513",
    gradient2: "#A0522D",
    gradient3: "#6B3410",
    blob1: "rgba(200, 100, 30, 0.6)",
    blob2: "rgba(180, 80, 20, 0.5)",
    blob3: "rgba(220, 120, 50, 0.5)",
    blob4: "rgba(240, 140, 60, 0.4)",
    blob5: "rgba(200, 90, 40, 0.4)",
    name: "orange",
  },
}

const ThemeContext = createContext({
  theme: themes.pink,
  themeName: "pink",
  setTheme: () => {},
  themes,
})

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("pink")

  const setTheme = useCallback((name) => {
    if (themes[name]) {
      setThemeName(name)
      const root = document.documentElement
      const t = themes[name]
      root.style.setProperty("--gradient-1", t.gradient1)
      root.style.setProperty("--gradient-2", t.gradient2)
      root.style.setProperty("--gradient-3", t.gradient3)
      root.style.setProperty("--blob-1", t.blob1)
      root.style.setProperty("--blob-2", t.blob2)
      root.style.setProperty("--blob-3", t.blob3)
      root.style.setProperty("--blob-4", t.blob4)
      root.style.setProperty("--blob-5", t.blob5)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
