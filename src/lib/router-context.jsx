import { createContext, useContext, useState, useCallback } from "react"

const RouterContext = createContext({ page: "home", navigate: () => {} })

export function RouterProvider({ children }) {
  const [page, setPage] = useState("home")

  const navigate = useCallback((to) => {
    console.log("[v0] NAVIGATE called with:", to, "| previous page was:", page)
    setPage(to)
    window.scrollTo(0, 0)
  }, [page])

  return (
    <RouterContext.Provider value={{ page, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}
