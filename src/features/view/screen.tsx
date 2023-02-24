import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useRef, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, FlatList } from "react-native";
//import { TouchableOpacity } from "react-native-gesture-handler";
import {
	Text,
	Image,
	YGroup,
	YStack
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MapboxGL from "@rnmapbox/maps";

import { MainStack } from "../../components/MainStack";

// Mapbox access token: pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.MapLibre || "MapLibre" ); // MapboxGL.TileServers.Mapbox
MapboxGL.setAccessToken(null);

const IMG_HEIGHT = 200;
const padding = { paddingBottom: IMG_HEIGHT, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params;
	const MAP = useRef<MapboxGL.MapView>(null),
		  CAMERA = useRef<MapboxGL.Camera>(null);

	const { height, width } = useWindowDimensions();
	const styles = StyleSheet.create({
		map: { flex: 1, width, height }
	});

	const [ pres, setPres ] = useState<any | null>(null);
	const [ images, setImages ] = useState<any[] | null>(null);
	const [ imgHeight, setImgHeight ] = useState<number>(IMG_HEIGHT);

	let scrollEnd = async (ev: any) => {
		//console.log( ev.target._internalFiberInstanceHandleDEV.child );
		if(!pres) { return; }
		let id = "0";

		let center = null;
		for(let c of pres.clusters) {
			if( c.imgs.indexOf(id) > -1 ) {
				center = c.center; break;
			}
		}

		CAMERA.current?.setCamera({
			centerCoordinate: center || [8, 50],
			zoomLevel: 7,
			heading: 0,
			pitch: 0,
			animationDuration: 4500,
			padding
		});
	};

	useEffect(() => {
		/*if(!MAP.current || !CAMERA.current) { return; }
		MAP.current.getVisibleBounds().then(b => console.log(b));*/

		AsyncStorage.getItem(id)
		.then(res => {
			if(!res) { return; }
			let p = JSON.parse(res);
			setImages(p.imgs);
			setPres(p);
		})
		.catch(err => console.error(err));
	}, []);

	return (
		<MainStack
			style={{ width, height }}
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
				width={width}
				height={imgHeight}
			>
				<FlatList // DOCS: https://reactnative.dev/docs/scrollview
					horizontal={true}
					pinchGestureEnabled={false}
					showsHorizontalScrollIndicator={false}
					pagingEnabled={true}
					decelerationRate="normal"
					snapToInterval={width}
					snapToAlignment="center"
					contentContainerStyle={{ paddingHorizontal: 0 }}
					contentInset={{
						top: 0, bottom: 0, left: 0, right: 0
					}}
					getItemLayout={(item, index) => ({
						length: width, offset: width * index, index
					})}
					onScrollEndDrag={scrollEnd}
					data={images}
					keyExtractor={item => item.id}
					renderItem={({item}) => (
						<Image
							id={item.id}
							src={item.uri}
							br={4}
							width={width - 30}
							height={imgHeight - 20}
							marginHorizontal={15}
							marginVertical={10}
							//onPressIn={() => setImgHeight(height - 80)}
							//onPressOut={() => setImgHeight(IMG_HEIGHT)}
						/>
					)}
				/>
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
