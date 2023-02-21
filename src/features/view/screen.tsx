import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useRef, useEffect, useState } from "react";
import { StyleSheet, Dimensions, Platform, ScrollView } from "react-native";
import {
	Text,
	Image,
	YGroup,
	YStack,
	XStack
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MapboxGL from "@rnmapbox/maps";

import { MainStack } from "../../components/MainStack";

// Mapbox access token: pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.MapLibre || "MapLibre" ); // MapboxGL.TileServers.Mapbox
MapboxGL.setAccessToken(null);

const dim = Dimensions.get('window');
const styles = StyleSheet.create({
	map: { flex: 1, width: dim.width, height: dim.height }
});

const imgHeight = 200;
const padding = { paddingBottom: imgHeight, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params;
	const MAP = useRef<MapboxGL.MapView>(null),
		  CAMERA = useRef<MapboxGL.Camera>(null);
	const [ pres, setPres ] = useState<any | null>(null);
	const [ images, setImages ] = useState<string[] | null>(null);
	const [ height, setHeight ] = useState<number>(imgHeight);
	let c = 0;

	AsyncStorage.getItem(id)
	.then(res => {
		if(!res) { return; }
		let p = JSON.parse(res);
		setImages(p.imgs);
		setPres(p);
	})
	.catch(err => console.error(err));

	let scrollEnd = async (ev: any) => {
		setHeight(imgHeight);

		//console.log( ev.target._internalFiberInstanceHandleDEV.child );
		//console.log(pres);
		if(!pres) { return; }
		let id = "0";

		let center = null;
		for(let c of pres.clusters) {
			if( c.imgs.indexOf(id) > -1 || true ) {
				center = c.center; break;
			}
		}
		if(!center) { return; }

		CAMERA.current?.setCamera({
			centerCoordinate: center,
			zoomLevel: 7,
			heading: 0,
			pitch: 0,
			animationDuration: 4500,
			padding
		});
	};

	let imgPress = async (ev: any) => {
		//let img = ev.target._internalFiberInstanceHandleDEV.pendingProps.id;
		setHeight(dim.height - 80);
	};

	useEffect(() => {
		/*if(!MAP.current || !CAMERA.current) { return; }
		MAP.current.getVisibleBounds().then(b => console.log(b));*/
	}, []);

	return (
		<MainStack>
			<YStack
				jc="center"
				ai="center"
				minWidth="100%"
				minHeight="100%"
			>
				<MapboxGL.MapView
					ref={MAP}
					projection="globe" // NOTE: globe view is only available with mapbox, not configured
					logoEnabled={false}
					attributionPosition={{ bottom: 5, right: 5 }}
					compassEnabled={true}
					surfaceView={true}
					style={styles.map}
					styleURL="https://api.maptiler.com/maps/basic-v2/style.json?key=wq39CbUriaDcSFHF3N9a"
				>
					<MapboxGL.Camera
						ref={CAMERA}
						centerCoordinate={[8, 50]}
						zoomLevel={3}
						animationMode="flyTo"
						padding={padding}
					/>
				</MapboxGL.MapView>
				<YStack
					pos="absolute"
					bottom={0}
					left={0}
					width={dim.width}
					height={height}
				>
					<ScrollView // DOCS: https://reactnative.dev/docs/scrollview
						horizontal={true}
						pinchGestureEnabled={false}
						pagingEnabled={true}
						decelerationRate="normal"
						snapToInterval={dim.width}
						snapToAlignment="center"
						contentContainerStyle={{ paddingHorizontal: 0 }}
						contentInset={{
							top: 0,
							bottom: 0,
							left: 0,
							right: 0
						}}
						onScrollEndDrag={scrollEnd}
					>
						<XStack
							width="auto"
							height="100%"
						>
							{images?.map((img: any) => (
								<Image
									key={c++}
									id={img.id}
									src={img.uri}
									br={4}
									width={dim.width - 30}
									height={height - 20}
									marginHorizontal={15}
									marginVertical={10}
									onPressOut={imgPress}
								/>
							))}
						</XStack>
					</ScrollView>
				</YStack>
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
