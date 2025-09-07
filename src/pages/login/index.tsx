import { Alert, Box, Button, CircularProgress, Container, FormControl, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { formatCPF, isValidCPF } from "../../core/utils/cpf"

export default function Login() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [formData, setFormData] = useState({
		cpf: formatCPF("35438040222"),
		password: "123456",
	})

	// Manipula as mudanças nos campos do formulário
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === "cpf") {
			setFormData({ ...formData, cpf: formatCPF(value) })
		} else {
			setFormData({ ...formData, [name]: value })
		}
	}

	// Envio do formulário de login
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")
		setLoading(true)

		// Validação do CPF
		if (!isValidCPF(formData.cpf)) {
			setError("CPF inválido")
			setLoading(false)
			return
		}

		const result = await login(formData.cpf, formData.password)

		// Resultado do login
		if (result.success) {
			setSuccess(result.message)
			setTimeout(() => {
				setLoading(false)
				navigate("/")
			}, 1500)
		} else {
			setError(result.message)
			setLoading(false)
		}
	}

	return (
		<Box px={3} minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
			<Container maxWidth="xs" sx={{ p: 4, bgcolor: "grey.900", borderRadius: 3, boxShadow: 3 }}>
				<Typography variant="h2" color="primary" align="center" mb={1}>
					Entrar
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				{success && (
					<Alert severity="success" sx={{ mb: 2 }}>
						{success}
					</Alert>
				)}
				<FormControl fullWidth sx={{ gap: 2 }} component="form" onSubmit={handleSubmit}>
					<TextField
						disabled={loading}
						label="CPF"
						name="cpf"
						type="text"
						value={formData.cpf}
						onChange={handleChange}
						fullWidth
						autoFocus
						required
						variant="outlined"
						color={isValidCPF(formData.cpf) ? "success" : undefined}
						error={formData.cpf !== "" && !isValidCPF(formData.cpf)}
					/>
					<TextField
						disabled={loading}
						label="Senha"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						fullWidth
						required
						variant="outlined"
					/>
					<Button
						disabled={loading}
						variant="contained"
						color="success"
						size="large"
						fullWidth
						type="submit"
						startIcon={loading ? <CircularProgress color="inherit" size={22} /> : null}
					>
						{loading ? "" : "Acessar"}
					</Button>
				</FormControl>
				<Stack direction="row" justifyContent="space-between" mt={2}>
					<Button component={Link} to="/cadastrar" size="small" color="primary" disabled={loading}>
						Cadastrar
					</Button>
					<Button component={Link} to="/" size="small" color="secondary" disabled={loading}>
						Voltar
					</Button>
				</Stack>
			</Container>
		</Box>
	)
}
