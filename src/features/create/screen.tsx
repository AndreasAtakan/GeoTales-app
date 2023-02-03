import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { Dimensions } from 'react-native';
import {
	Text,
	Image,
	YGroup,
	YStack
} from "tamagui";

//import mapboxgl from 'mapbox-gl';

import { MainStack } from "../../components/MainStack";
import { SelectImages } from "./select-images";

// TODO: https://github.com/rnmapbox/maps

//mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVhc2F0YWthbiIsImEiOiJja3dqbGlham0xMDAxMnhwazkydDRrbDRwIn0.zQJIqHf0Trp--7GHLc4ySg';

export const CreateScreen: FC< NativeStackScreenProps<StackNavigatorParams, "create"> > = ({ navigation }) => {
	const windowWidth = Dimensions.get('window').width,
		  windowHeight = Dimensions.get('window').height;

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
				<Image
					src={require('../../assets/images/map_background.png')}
					width={windowWidth}
					height={windowHeight}
					blurRadius={3}
					position="absolute"
					zIndex={0}
				/>
				<SelectImages navigation={navigation} />
			</YStack>
		</MainStack>
	);
};
