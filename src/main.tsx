import { CssBaseline, ThemeProvider } from "@mui/material"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { theme } from "./core/theme"
import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<HashRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/cadastrar" element={<Register />} />
						<Route path="*" element={<Home />} />
					</Routes>
				</HashRouter>
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>
)
