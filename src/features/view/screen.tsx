import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useRef, useEffect, useState, useCallback } from "react";
import { useWindowDimensions, StyleSheet, FlatList, Animated as RNAnimated, Easing } from "react-native";
//import { TouchableOpacity } from "react-native-gesture-handler";
import {
	H4,
	Card,
	Image,
	Avatar
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MapboxGL, { Terrain as MapboxGLTerrain } from "@rnmapbox/maps";

import { length, lineString } from "@turf/turf";

import moment from "moment";

import { MainStack } from "../../components/MainStack";

// Access token: pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg
MapboxGL.setWellKnownTileServer( MapboxGL.TileServers.Mapbox || "Mapbox" ); // MapboxGL.TileServers.MapLibre
MapboxGL.setAccessToken("pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg");

const AnimatedMarkerView = RNAnimated.createAnimatedComponent(MapboxGL.MarkerView);

const IMG_HEIGHT = 200;
const padding = { paddingBottom: IMG_HEIGHT, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };

export const ViewScreen: FC< NativeStackScreenProps<StackNavigatorParams, "view"> > = ({ route, navigation }) => {
	const { id } = route.params;
	const MAP = useRef<MapboxGL.MapView>(null),
		  CAMERA = useRef<MapboxGL.Camera>(null),
		  presRef = useRef<any>(null), routeRef = useRef<any>(null), imgRef = useRef<any>(null);

	const { height, width } = useWindowDimensions();
	const styles = StyleSheet.create({
		map: { flex: 1, width, height }
	});

	const [ pres, setPres ] = useState<any | null>(null);
	const [ images, setImages ] = useState<any[] | null>(null);
	const [ mapEnabled, setMapEnabled ] = useState<boolean>(true);
	const [ objectPoint, setObjectPoint ] = useState<number[]>([0,0]);
	const [ objectFocus, setObjectFocus ] = useState<boolean>(false);
	const [ objectRoute, setObjectRoute ] = useState<any>(null);

	imgRef.current = images;
	const imgHeight = useRef(new RNAnimated.Value(IMG_HEIGHT)).current;
	const imgOpen = useCallback((index: number) => {
		let h = (width - 30) / imgRef.current[index].ratio;
		RNAnimated.timing(imgHeight, {
			toValue: Math.min(h, height - 30),
			//easing: Easing.cubic,
			duration: 350,
			useNativeDriver: false
		}).start();
	}, []);
	const imgClose = useCallback(() => {
		RNAnimated.timing(imgHeight, {
			toValue: IMG_HEIGHT,
			//easing: Easing.cubic,
			duration: 350,
			useNativeDriver: false
		}).start();
	}, []);

	routeRef.current = objectRoute;
	const animateObject = useCallback((duration: number) => {
		let route = routeRef.current;
		if(!route) { return; }

		const ts = lineString(route.__getValue());
		const total = length(ts, { units: 'meters' });
		const points = route.__getValue();
		const endPoint = points[points.length - 1];

		route
			.timing({
				toValue: { end: { point: endPoint, from: total } },
				easing: Easing.linear,
				//useNativeDriver: true,
				duration
			})
			.start(({ finished }: any) => {
				if(finished) { setMapEnabled(true); }
			});
	}, []);

	presRef.current = pres;
	const scrollEnd = useCallback(({ changed, viewableItems }: any) => {
		let p = presRef.current;
		if(!p || !CAMERA.current) { return; }

		let id = changed[0].item.id,
			path = [], point = null;
		for(let cluster of p.clusters) {
			path.push(cluster.center);
			if( cluster.imgs.indexOf(id) > -1 ) {
				point = cluster.center; break;
			}
		}
		if(!point) { return; }

		setMapEnabled(false);
		const duration = 20000;

		let f = Math.random() <= 0.5 ? 1 : -1;
		CAMERA.current.setCamera({
			type: "CameraStop",
			centerCoordinate: point,
			zoomLevel: 16 + Math.random() * 0.001, // NOTE: Random element is to ensure that the zoom level is slightly different each time it is called, this is to force Mapbox to actually do the flyTo animation each time (Mapbox will not trigger the animation if the zoom levels are exactly the same)
			heading: Math.random() * 90 * f,
			pitch: Math.random() * 75,
			animationMode: "flyTo",
			animationDuration: duration,
			padding
		});

		setObjectPoint(point);
		setTimeout(() => setMapEnabled(true), duration);

		/*if(path.length <= 1) { path.push(path[0]); }
		let animatedRoute = new MapboxGL.Animated.RouteCoordinatesArray(path, {
			end: { from: length(lineString(path)) }
		});
		setObjectRoute(animatedRoute);
		setObjectPoint( new MapboxGL.Animated.ExtractCoordinateFromArray(animatedRoute, -1) );
		animateObject(duration);*/
	}, []);

	const objectClick = () => { setObjectFocus( !objectFocus ); };

	useEffect(() => {
		/*if(!MAP.current) { return; }
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
				projection="globe"
				attributionPosition={{ bottom: 5, right: 5 }}
				logoEnabled={false}
				compassEnabled={true}
				compassFadeWhenNorth={true}
				scaleBarEnabled={false}
				//surfaceView={true}
				style={styles.map}
				styleURL="mapbox://styles/andreasatakan/cknsrmz140j2o17o3g4chphee"
				zoomEnabled={mapEnabled}
				scrollEnabled={mapEnabled}
				pitchEnabled={mapEnabled}
				rotateEnabled={mapEnabled}
				//onRegionIsChanging={animateObject}
			>
				<MapboxGL.Camera
					ref={CAMERA}
					centerCoordinate={[8, 50]}
					zoomLevel={3}
					maxZoomLevel={22}
					//animationMode="flyTo"
					padding={padding}
				/>

				<AnimatedMarkerView
					coordinate={objectPoint}
					isSelected={objectFocus}
					allowOverlap={true}
					//anchor={{ x: 0.5, y: 1 }}
					//style={{ display: objectPoint.reduce((p,a) => p + a, 0) == 0 ? "none" : "flex" }}
				>
					<Avatar
						circular={false}
						size="$5"
						/*style={{
							borderWidth: 2,
							borderColor: objectFocus ? "#0000cc" : "#999999",
							borderStyle: "solid"
						}}*/
						onPress={objectClick}
					>
						<Avatar.Image
							src="https://nfedb.no/assets/car.png"
							accessibilityLabel="Focus object"
							resizeMode="contain"
							als="center"
						/>
						<Avatar.Fallback backgroundColor="rgba(0,0,0,0)" />
					</Avatar>
				</AnimatedMarkerView>

				<MapboxGL.Animated.ShapeSource
					id="object-route-source"
					shape={ objectRoute ? lineString(objectRoute) : undefined }
				>
					<MapboxGL.Animated.LineLayer
						id="object-route"
						sourceID="object-route-source"
						style={{
							lineColor: 'rgba(255,0,0,0)',
							lineWidth: 3,
							lineCap: 'round',
							lineJoin: 'round'
						}}
					/>
				</MapboxGL.Animated.ShapeSource>

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

			<RNAnimated.View
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					height: imgHeight,
					width,
				}}
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
						minimumViewTime: 250,
						itemVisiblePercentThreshold: 50
					}}
					data={images}
					keyExtractor={item => item.id}
					renderItem={({ item, index }) => (
						<Card
							theme="light"
							width={width - 30}
							//height={imgHeight - 20}
							elevate={true}
							marginVertical={10}
							marginHorizontal={15}
							onPressIn={() => imgOpen(index)}
							onPressOut={imgClose}
						>
							<Card.Footer padded>
								<H4 color="#e6e6e6">
									{`${moment.unix(item.timestamp).format("D MMM, HH:MM")}`}
								</H4>
							</Card.Footer>
							<Card.Background>
								<Image
									id={item.id}
									src={item.uri}
									br={4}
									width={width - 30}
									height="100%"
									resizeMode="cover"
									als="center"
								/>
							</Card.Background>
						</Card>
					)}
				/>
			</RNAnimated.View>
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
