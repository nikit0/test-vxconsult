import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#ff6a00",
		},
		secondary: {
			main: "#ee0979",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					userSelect: "none",
				},
			},
		},
		MuiTypography: {
			variants: [
				{
					props: { variant: "h2", color: "primary" },
					style: {
						background: "linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						letterSpacing: 2,
						fontSize: "3rem",
						fontWeight: 900,
						marginBottom: 16,
					},
				},
			],
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					fontWeight: 700,
				},
			},
			variants: [
				{
					props: { variant: "contained" },
					style: {
						background: "linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)",
						boxShadow: "0 2px 8px 0 #ee097955",
						transition: "background 0.3s",
						"&:hover": {
							background: "linear-gradient(90deg, #ee0979 0%, #ff6a00 100%)",
						},
					},
				},
				{
					props: { variant: "outlined" },
					style: {
						borderColor: "#ff6a00",
						color: "#ff6a00",
						transition: "color 0.3s, border-color 0.3s",
						"&:hover": {
							borderColor: "#ee0979",
							color: "#ee0979",
						},
					},
				},
			],
		},
	},
})
