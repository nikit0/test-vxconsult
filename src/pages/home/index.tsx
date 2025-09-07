import { Box, Button, Paper, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import Map from "../../components/Map"
import { useAuth } from "../../contexts/AuthContext"

export default function Home() {
	const { isLogged, logout, user } = useAuth()

	const handleLogout = () => {
		logout()
	}

	return (
		<Box
			minHeight="100vh"
			sx={{
				display: { xs: "block", md: "flex" },
				alignItems: "center",
				justifyContent: "center",
				p: { xs: 2, md: 6 },
				gap: { xs: 3, md: 6 },
			}}
		>
			<Paper
				sx={{
					borderRadius: "10px",
					textAlign: "center",
					maxWidth: "440px",
					p: { xs: 3, md: 6 },
					mb: { xs: 3, md: 0 },
				}}
			>
				<Typography variant="h2" color="primary">
					VXConsult
				</Typography>
				<Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
					Soluções inteligentes para localização e análise de dados geográficos
				</Typography>
				{isLogged ? (
					<>
						<Typography variant="body1" sx={{ mb: 2 }}>
							Bem-vindo, {user?.name}!
						</Typography>
						<Stack direction="row" spacing={2} justifyContent="center" mb={4}>
							<Button variant="contained" size="large" sx={{ px: 5 }} onClick={handleLogout}>
								Desconectar
							</Button>
						</Stack>
					</>
				) : (
					<Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" mb={4}>
						<Button component={Link} to="/login" variant="contained" size="large" sx={{ px: 5 }}>
							Login
						</Button>
						<Button component={Link} to="/cadastrar" variant="outlined" size="large" sx={{ px: 5 }}>
							Cadastrar
						</Button>
					</Stack>
				)}
				<Typography variant="body2" sx={{ fontSize: "1rem" }}>
					Explore o mapa interativo
				</Typography>
			</Paper>

			<Map />
		</Box>
	)
}
