import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useRef, useEffect, useState, useCallback } from "react";
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
import { Terrain as MapboxGLTerrain } from "@rnmapbox/maps";

import { MainStack } from "../../components/MainStack";

// Access token: pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.Mapbox || "Mapbox" ); // MapboxGL.TileServers.MapLibre
MapboxGL.setAccessToken("pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg");

const IMG_HEIGHT = 200;
const padding = { paddingBottom: IMG_HEIGHT, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params;
	const MAP = useRef<MapboxGL.MapView>(null),
		  CAMERA = useRef<MapboxGL.Camera>(null),
		  presRef = useRef(null);

	const { height, width } = useWindowDimensions();
	const styles = StyleSheet.create({
		map: { flex: 1, width, height }
	});

	const [ pres, setPres ] = useState<any | null>(null);
	const [ images, setImages ] = useState<any[] | null>(null);
	const [ imgHeight, setImgHeight ] = useState<number>(IMG_HEIGHT);

	presRef.current = pres;

	const scrollEnd = useCallback(({ changed, viewableItems }) => {
		let p = presRef.current;
		if(!p) { return; }

		let id = changed[0].item.id,
			center = null;
		for(let c of p.clusters) {
			if( c.imgs.indexOf(id) > -1 ) {
				center = c.center; break;
			}
		}
		if(!center) { return; }

		CAMERA.current?.setCamera({
			centerCoordinate: center,
			zoomLevel: 16,
			heading: 0,
			pitch: 0,
			animationMode: "flyTo",
			animationDuration: 10000,
			padding
		});
	}, []);

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
				projection="globe" // NOTE: globe view only available with mapbox
				attributionPosition={{ bottom: 5, right: 5 }}
				logoEnabled={false}
				compassEnabled={true}
				compassFadeWhenNorth={true}
				scaleBarEnabled={false}
				//surfaceView={true}
				style={styles.map}
				styleURL="mapbox://styles/andreasatakan/cknsrmz140j2o17o3g4chphee"
			>
				<MapboxGL.Camera
					ref={CAMERA}
					centerCoordinate={[8, 50]}
					zoomLevel={3}
					maxZoomLevel={22}
					//animationMode="flyTo"
					padding={padding}
				/>
				<MapboxGL.RasterDemSource
					id="terrain"
					url="mapbox://mapbox.mapbox-terrain-dem-v1"
					minZoomLevel={10}
					maxZoomLevel={14}
				>
					<MapboxGL.Atmosphere
						style={{
							color: 'rgb(186, 210, 235)',
							highColor: 'rgb(36, 92, 223)',
							horizonBlend: 0.02,
							spaceColor: 'rgb(11, 11, 25)',
							starIntensity: 0.6
						}}
					/>
					<MapboxGL.SkyLayer
						id="sky-layer"
						style={{
							skyType: 'atmosphere',
							skyAtmosphereSun: [0.0, 0.0],
							skyAtmosphereSunIntensity: 15.0
						}}
					/>
					<MapboxGLTerrain
						style={{
							source: "terrain",
							exaggeration: 1
						}}
					/>
				</MapboxGL.RasterDemSource>
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
					contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
					getItemLayout={(item, index) => ({ length: width, offset: width * index, index })}
					onViewableItemsChanged={scrollEnd}
					viewabilityConfig={{
						minimumViewTime: 500,
						itemVisiblePercentThreshold: 50
					}}
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
