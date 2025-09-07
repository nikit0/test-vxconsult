// Formata o CPF para o padrão 000.000.000-00
export function formatCPF(cpf: string | number): string {
	let value = String(cpf).replace(/\D/g, "").slice(0, 11)
	if (value.length <= 3) return value
	if (value.length <= 6) return value.replace(/^(\d{3})(\d+)/, "$1.$2")
	if (value.length <= 9) return value.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3")
	return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
}

// Valida o CPF (estrutura e dígitos verificadores)
export function isValidCPF(cpf: string): boolean {
	const RESERVED_NUMBERS = [
		"00000000000",
		"11111111111",
		"22222222222",
		"33333333333",
		"44444444444",
		"55555555555",
		"66666666666",
		"77777777777",
		"88888888888",
		"99999999999",
	]

	let value = cpf.replace(/\D/g, "")
	if (value.length !== 11 || RESERVED_NUMBERS.includes(value)) return false

	// Validação do primeiro dígito verificador
	let sum = 0
	for (let i = 0; i < 9; i++) sum += Number(value[i]) * (10 - i)
	let firstCheck = (sum * 10) % 11
	if (firstCheck === 10) firstCheck = 0
	if (firstCheck !== Number(value[9])) return false

	// Validação do segundo dígito verificador
	sum = 0
	for (let i = 0; i < 10; i++) sum += Number(value[i]) * (11 - i)
	let secondCheck = (sum * 10) % 11
	if (secondCheck === 10) secondCheck = 0
	if (secondCheck !== Number(value[10])) return false

	return true
}
