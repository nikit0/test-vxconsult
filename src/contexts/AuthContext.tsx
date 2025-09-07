import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Tipos
interface User {
	name: string
	email: string
	cpf: string
	password: string
	logged: boolean
	polygons?: { points: [number, number][]; color: string; name: string }[]
}

interface AuthContextType {
	user: User | null
	isLogged: boolean
	login: (cpf: string, password: string) => Promise<{ success: boolean; message: string }>
	register: (userData: Omit<User, "logged">) => Promise<{ success: boolean; message: string }>
	logout: () => void
	checkAuth: () => void
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)

	// Função para verificar se existe usuário logado
	const checkAuth = () => {
		try {
			const users = JSON.parse(localStorage.getItem("users") || "[]")
			const loggedUser = users.find((u: User) => u.logged)
			setUser(loggedUser || null)
		} catch (error) {
			setUser(null)
		}
	}

	// Função de login
	const login = async (cpf: string, password: string): Promise<{ success: boolean; message: string }> => {
		let result = { success: false, message: "" }
		await new Promise((resolve) => {
			setTimeout(() => {
				try {
					let users = JSON.parse(localStorage.getItem("users") || "[]")
					const userIndex = users.findIndex((u: User) => u.cpf === cpf)

					if (userIndex === -1) {
						result = { success: false, message: "Usuário não encontrado" }
						return resolve(null)
					}

					if (users[userIndex].password !== password) {
						result = { success: false, message: "Senha incorreta" }
						return resolve(null)
					}

					// Marcar todos como deslogados e só o usuário atual como logado
					users = users.map((u: User, i: number) => ({ ...u, logged: i === userIndex }))
					localStorage.setItem("users", JSON.stringify(users))

					setUser(users[userIndex])
					result = { success: true, message: "Login realizado com sucesso" }
				} catch (error) {
					result = { success: false, message: "Erro interno! Tente novamente" }
				}
				resolve(null)
			}, 1500)
		})
		return result
	}

	// Função de registro
	const register = async (userData: Omit<User, "logged">): Promise<{ success: boolean; message: string }> => {
		let result = { success: false, message: "" }
		await new Promise((resolve) => {
			setTimeout(() => {
				try {
					const users = JSON.parse(localStorage.getItem("users") || "[]")

					if (users.some((u: User) => u.cpf === userData.cpf)) {
						result = { success: false, message: "Já existe uma conta com este CPF" }
						return resolve(null)
					}

					const newUser: User = { ...userData, logged: false }
					users.push(newUser)
					localStorage.setItem("users", JSON.stringify(users))

					result = { success: true, message: "Conta criada com sucesso" }
				} catch (error) {
					result = { success: false, message: "Erro interno! Tente novamente" }
				}
				resolve(null)
			}, 1500)
		})
		return result
	}

	// Função de logout
	const logout = () => {
		try {
			let users = JSON.parse(localStorage.getItem("users") || "[]")
			users = users.map((u: User) => ({ ...u, logged: false }))
			localStorage.setItem("users", JSON.stringify(users))
			setUser(null)
		} catch {
			null
		}
	}

	// Verificar auth ao inicializar
	useEffect(() => {
		checkAuth()
	}, [])

	const value: AuthContextType = {
		user,
		isLogged: !!user,
		login,
		register,
		logout,
		checkAuth,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider")
	}
	return context
}
