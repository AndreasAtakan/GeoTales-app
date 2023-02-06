import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useRef, useEffect } from "react";
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
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.MapLibre || "MapLibre" ); // MapboxGL.TileServers.Mapbox
MapboxGL.setAccessToken(null);

const dim = Dimensions.get('window');
const styles = StyleSheet.create({
	map: { flex: 1, width: dim.width, height: dim.height }
});

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params, MAPREF: any = useRef(null);

	useEffect(() => {
		console.log( MAPREF.current.getVisibleBounds() );
	});

	return (
		<MainStack>
			<YStack
				justifyContent="center"
				alignItems="center"
				minHeight="100%"
			>
				<MapboxGL.MapView
					ref={MAPREF}
					projection="globe" // NOTE: globe view is only available with mapbox 
					logoEnabled={false}
					attributionPosition={{ bottom: 5, right: 5 }}
					compassEnabled={true}
					surfaceView={true}
					style={styles.map}
					styleURL="https://api.maptiler.com/maps/basic-v2/style.json?key=wq39CbUriaDcSFHF3N9a"
				>
					<MapboxGL.Camera centerCoordinate={[8, 50]} zoomLevel={3} />
				</MapboxGL.MapView>
			</YStack>
		</MainStack>
	);
};

/*

JSON.stringify({
	sources: {
		map: {
			type: 'raster',
			tiles: [ 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' ],
			attribution: '&copy; OpenStreetMap Contributors',
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
})

JSON.stringify({
	sources: {
		osm: {
			type: 'raster',
			tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
			tileSize: 256,
			attribution: '&copy; OpenStreetMap Contributors',
			maxzoom: 19
		},
		terrainSource: {
			type: 'raster-dem',
			url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
			tileSize: 256
		},
		hillshadeSource: {
			type: 'raster-dem',
			url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
			tileSize: 256
		}
	},
	layers: [
		{
			id: 'osm',
			type: 'raster',
			source: 'osm'
		},
		{
			id: 'hills',
			type: 'hillshade',
			source: 'hillshadeSource',
			layout: { visibility: 'visible' },
			paint: { 'hillshade-shadow-color': '#473B24' }
		}
	],
	terrain: {
		source: 'terrainSource',
		exaggeration: 1
	}
});

*/
