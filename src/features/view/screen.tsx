import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import {
	Text,
	Image,
	YGroup,
	YStack
} from "tamagui";

import MapboxGL from "@rnmapbox/maps";

import { MainStack } from "../../components/MainStack";

// Mapbox access token: pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg
MapboxGL.setAccessToken(null);
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.MapLibre || MapboxGL.TileServers.Mapbox );

const windowWidth = Dimensions.get('window').width,
	  windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
	map: {
		flex: 1,
		width: windowWidth,
		height: windowHeight
	}
});

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params;

	/*const mapContainer: any = useRef(null);
	const map: any = useRef(null);
	const lng = -70.9, lat = 42.35, zoom = 9;

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom
		});
	});*/

	return (
		<MainStack>
			<YStack
				justifyContent="center"
				alignItems="center"
				minHeight="100%"
			>
				<MapboxGL.MapView
					style={styles.map}
					styleURL="https://demotiles.maplibre.org/style.json"
				/>
			</YStack>
		</MainStack>
	);
};

/*
<MapboxGL.MapView
	style={{
		width: `${windowWidth}px`,
		height: `${windowHeight}px`,
		flex: 1
	}}
	styleJSON={JSON.stringify({
		version: 8,
		name: 'Land',
		sources: {
			map: {
				type: 'raster',
				tiles: [ 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' ],
				tileSize: 256,
				minzoom: 1,
				maxzoom: 19
			}
		},
		layers: [
			{
				id: 'background',
				type: 'background',
				paint: {
					'background-color': '#f2efea'
				}
			},
			{
				id: 'map',
				type: 'raster',
				source: 'map',
				paint: {
					'raster-fade-duration': 100
				}
			}
		]
	})}
>
	<MapboxGL.Camera centerCoordinate={[-74.00597, 40.71427]} zoomLevel={14} />
</MapboxGL.MapView>
*/
