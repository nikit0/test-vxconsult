import { Alert, Box, Button, CircularProgress, Container, FormControl, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { formatCPF, isValidCPF } from "../../core/utils/cpf"

export default function Register() {
	const navigate = useNavigate()
	const { register, isLogged } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [form, setForm] = useState({
		name: "Marcos Vinicius",
		email: "mv@email.com",
		cpf: formatCPF("35438040222"),
		password: "123456",
		confirmPassword: "123456",
	})

	// Redirecionar se já estiver logado
	useEffect(() => {
		if (isLogged) {
			navigate("/")
		}
	}, [isLogged, navigate])

	// Manipula as mudanças nos campos do formulário
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === "cpf") {
			setForm({ ...form, cpf: formatCPF(value) })
		} else {
			setForm({ ...form, [name]: value })
		}
	}

	// Envio do formulário de registro
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")
		setLoading(true)

		// Validação de CPF
		if (!isValidCPF(form.cpf)) {
			setError("CPF inválido")
			setLoading(false)
			return
		}

		// Validação de senha
		if (form.password !== form.confirmPassword) {
			setError("As senhas não coincidem")
			setLoading(false)
			return
		}

		// Validação de tamanho da senha
		if (form.password.length < 6) {
			setError("A senha deve ter pelo menos 6 caracteres")
			setLoading(false)
			return
		}

		const { confirmPassword, ...userData } = form
		const result = await register(userData)

		// Resultado do registro
		if (result.success) {
			setSuccess(result.message)
			setTimeout(() => {
				setLoading(false)
				navigate("/login")
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
					Criar Conta
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
						label="Nome"
						name="name"
						value={form.name}
						onChange={handleChange}
						fullWidth
						autoFocus
						required
						variant="outlined"
					/>
					<TextField
						disabled={loading}
						label="E-mail"
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						fullWidth
						required
						variant="outlined"
					/>
					<TextField
						disabled={loading}
						label="CPF"
						name="cpf"
						type="text"
						value={form.cpf}
						onChange={handleChange}
						fullWidth
						required
						variant="outlined"
						color={isValidCPF(form.cpf) ? "success" : undefined}
						error={form.cpf !== "" && !isValidCPF(form.cpf)}
					/>
					<TextField
						disabled={loading}
						label="Senha"
						name="password"
						type="password"
						value={form.password}
						onChange={handleChange}
						fullWidth
						required
						variant="outlined"
					/>
					<TextField
						disabled={loading}
						label="Confirmar Senha"
						name="confirmPassword"
						type="password"
						value={form.confirmPassword}
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
						{loading ? "" : "Criar Conta"}
					</Button>
				</FormControl>
				<Stack direction="row" justifyContent="space-between" mt={2}>
					<Button component={Link} to="/login" size="small" color="primary" disabled={loading}>
						Já tenho conta
					</Button>
					<Button component={Link} to="/" size="small" color="secondary" disabled={loading}>
						Voltar
					</Button>
				</Stack>
			</Container>
		</Box>
	)
}
