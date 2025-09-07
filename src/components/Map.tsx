import { Add, Delete, Done, LocationOn, Map as MapIcon, Place } from "@mui/icons-material"
import { Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import type { LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import { LayersControl, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvent } from "react-leaflet"
import { useAuth } from "../contexts/AuthContext"
import randomColor from "../core/utils/colors"

const initMapZoom = 12
const initMapCenter: LatLngTuple = [-22.7268, -47.6463]
const initMarker: LatLngTuple = [-22.7041, -47.65]

const initPolygonColor = { color: "purple" }
const initPolygon: LatLngTuple[] = [
	[-22.7038, -47.6536],
	[-22.7061, -47.6527],
	[-22.705, -47.6498],
	[-22.7049, -47.6477],
	[-22.703, -47.6484],
]

// Componente para capturar cliques no mapa
function ClickHandler({ onClick }: { onClick: (latlng: LatLngTuple) => void }) {
	useMapEvent("click", (e) => {
		onClick([e.latlng.lat, e.latlng.lng])
	})

	return null
}

export default function Map() {
	const { isLogged, user } = useAuth()
	const [drawing, setDrawing] = useState(false)
	const [deleteMode, setDeleteMode] = useState(false)
	const [polygons, setPolygons] = useState<{ points: LatLngTuple[]; color: string; name: string }[]>([])
	const [currentPolygon, setCurrentPolygon] = useState<LatLngTuple[]>([])

	// Carrega polígonos do usuário ao logar
	useEffect(() => {
		if (user?.polygons) {
			setPolygons(user.polygons)
		}

		if (!isLogged) {
			setPolygons([])
			setDrawing(false)
			setDeleteMode(false)
			setCurrentPolygon([])
		}
	}, [user])

	// Adiciona ponto ao polígono em desenho
	const handleMapClick = (latlng: LatLngTuple) => {
		if (drawing) setCurrentPolygon((prev) => [...prev, latlng])
	}

	// Inicia o desenho de um novo polígono
	const handleAddPolygon = () => {
		setDrawing(true)
		setCurrentPolygon([])
	}

	// Atualiza os polígonos do usuário no localStorage
	function updateUserPolygons(cpf: string, newPolygons: any[]) {
		const users = JSON.parse(localStorage.getItem("users") || "[]")
		const updated = users.map((u: typeof user) => (u?.cpf === cpf ? { ...u, polygons: newPolygons } : u))
		localStorage.setItem("users", JSON.stringify(updated))
	}

	// Finaliza o polígono em desenho, se tiver ao menos 3 pontos
	const handleFinishPolygon = () => {
		if (currentPolygon.length >= 3) {
			const name = window.prompt("Digite um nome para o polígono ou deixe em branco:") || `Polígono ${polygons.length + 1}`
			const newPoly = { points: currentPolygon, color: randomColor(), name }
			const newPolygons = [...polygons, newPoly]
			setPolygons(newPolygons)
			setCurrentPolygon([])
			setDrawing(false)

			if (user?.cpf) updateUserPolygons(user.cpf, newPolygons)
		}
	}

	// Ativa/desativa modo de exclusão
	const handleRemovePolygon = () => setDeleteMode((prev) => !prev)

	const handlePolygonClick = (idx: number) => {
		if (deleteMode) {
			const newPolygons = polygons.filter((_, i) => i !== idx)
			setPolygons(newPolygons)
			setDeleteMode(false)
			if (user?.cpf) updateUserPolygons(user.cpf, newPolygons)
		}
	}

	return (
		<Box sx={{ position: "relative", width: "min(100vw, 100%)", height: "min(70vh, 500px)" }}>
			{/* Menu fixo do MUI */}
			{isLogged && (
				<Paper sx={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
					<Tooltip title="Novo Polígono">
						<IconButton color="primary" onClick={handleAddPolygon} disabled={drawing}>
							<Add />
						</IconButton>
					</Tooltip>
					<Tooltip title="Finalizar">
						<IconButton color="success" onClick={handleFinishPolygon} disabled={!drawing || currentPolygon.length < 3}>
							<Done />
						</IconButton>
					</Tooltip>
					{polygons.length > 0 && (
						<Tooltip title={deleteMode ? "Clique em um polígono para remover" : "Ativar modo excluir"}>
							<IconButton color={deleteMode ? "success" : "error"} onClick={handleRemovePolygon} disabled={drawing}>
								<Delete />
							</IconButton>
						</Tooltip>
					)}
				</Paper>
			)}

			<MapContainer style={{ height: "100%", width: "100%", borderRadius: "10px" }} zoom={initMapZoom} center={initMapCenter} scrollWheelZoom>
				<LayersControl position="topleft">
					{/* Base Layers */}
					<LayersControl.BaseLayer checked name="OpenStreetMap">
						<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Topo Map">
						<TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="&copy; OpenTopoMap contributors" />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Esri Satellite">
						<TileLayer
							url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
							attribution="Tiles &copy; Esri &mdash; Source: Esri, NASA, USGS"
						/>
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Carto Light">
						<TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Carto Dark">
						<TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
					</LayersControl.BaseLayer>

					{/* Polígonos criados pelo usuário */}
					{isLogged &&
						polygons.map((poly, idx) => (
							<LayersControl.Overlay key={idx} name={poly.name} checked>
								<Polygon
									positions={poly.points}
									pathOptions={{ color: poly.color }}
									eventHandlers={deleteMode ? { click: () => handlePolygonClick(idx) } : undefined}
								>
									<Popup minWidth={220}>
										<Stack direction="row" alignItems="center" spacing={1} mb={1}>
											<MapIcon color="secondary" />
											<Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
												{poly.name}
											</Typography>
											<Chip size="small" icon={<Place />} label={`#${idx + 1}`} color="secondary" />
										</Stack>
										<Divider sx={{ mb: 1, borderColor: "pink" }} />
										<Stack spacing={0.5}>
											<Typography variant="body1" color="secondary" fontWeight={700} mb={0.5} sx={{ fontSize: "1.05em" }}>
												<LocationOn color="secondary" fontSize="small" sx={{ verticalAlign: "middle" }} /> Coordenadas
											</Typography>
											{poly.points.map((p, i) => (
												<Typography key={i} variant="body2" sx={{ userSelect: "text", fontSize: "0.95em", pl: 1 }}>
													[{p[0].toFixed(6)}, {p[1].toFixed(6)}]
												</Typography>
											))}
										</Stack>
									</Popup>
								</Polygon>
							</LayersControl.Overlay>
						))}

					{/* Polígono em desenho */}
					{drawing && currentPolygon.length > 1 && (
						<LayersControl.Overlay name="Polígono em desenho" checked>
							<Polygon positions={currentPolygon} pathOptions={{ color: "#ff9800", dashArray: "6" }} />
						</LayersControl.Overlay>
					)}

					{/* Polígono inicial fixo */}
					<LayersControl.Overlay name="Polígono inicial" checked>
						<Polygon positions={initPolygon} pathOptions={initPolygonColor} />
					</LayersControl.Overlay>
				</LayersControl>

				<ClickHandler onClick={handleMapClick} />

				{/* Marcador fixo */}
				<Marker position={initMarker}>
					<Popup>Shopping Piracicaba</Popup>
				</Marker>
			</MapContainer>
		</Box>
	)
}
