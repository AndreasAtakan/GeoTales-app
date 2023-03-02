import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useState } from "react";
import { Alert, PermissionsAndroid, Platform, useWindowDimensions } from "react-native";
import { Plus } from "@tamagui/lucide-icons";
import {
	H3,
	Text,
	YGroup,
	YStack,
	Button,
	ScrollView,
	XStack,
	Spinner,
	Sheet,
	Card,
	Image
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";

import uuid from "../../utils/uuid";

import Pres from "../../autopres";

import { MainStack } from "../../components/MainStack";
import { LoadingModal } from "./loading-modal";
import { JourneysModal } from "./journeys-modal";
import { JourneyModal } from "./journey-modal";
import { SelectModal } from "./select-modal";

async function hasAndroidPermission() {
	const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

	const hasPermission = await PermissionsAndroid.check(permission);
	if(hasPermission) { return true; }

	const status = await PermissionsAndroid.request(permission, {
		title: "GeoTales needs access to your images",
		message: "We need this access so the app may properly funciton",
		//buttonNeutral: 'Ask Me Later',
		buttonNegative: 'Cancel',
		buttonPositive: 'OK'
	});
	return status === PermissionsAndroid.RESULTS.GRANTED;
}

export const CreateScreen: FC< NativeStackScreenProps<StackNavigatorParams, "create"> > = ({ navigation }) => {
	const { height, width } = useWindowDimensions();

	const [ images, setImages ] = useState<any[] | null>(null);

	const [ loading, setLoading ] = useState<boolean>(false);
	const [ journeys, setJourneys ] = useState<any[] | null>(null);
	const [ journey, setJourney ] = useState<any[] | null>(null);
	const [ select, setSelect ] = useState<boolean>(false);

	const readImgs = async () => {
		if(Platform.OS === "android" && !(await hasAndroidPermission())) {
			navigation.popToTop();
			return;
		}

		setLoading(true);

		try {
			// DOCS: https://github.com/react-native-cameraroll/react-native-cameraroll
			let res = await CameraRoll.getPhotos({
				first: 10000,
				assetType: "All",
				include: [ "location", "imageSize" ]
			});

			let imgs = res.edges.filter((v: PhotoIdentifier) => !!v.node.location).map((v: PhotoIdentifier) => v.node);
			imgs.sort((u, v) => u.timestamp - v.timestamp);
			setImages(imgs);
			console.log( imgs.length );

			// TODO: Call algo that turns image list into suggested journeys
			// imgs = algo(imgs);

			setLoading(false);

			let l = []; for(let i = 0; i < 5; i++) { l.push(imgs); }
			setJourneys(l);
		}
		catch(err) {
			setLoading(false);
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}
	};

	let createMap = async (imgs: any[]) => {
		setLoading(true);

		try {
			let pres = new Pres(imgs, 10, [8, 50]);

			const id = uuid();
			await AsyncStorage.setItem( id, JSON.stringify(pres) );

			setLoading(false);

			navigation.replace("view", { id });
		}
		catch(err) {
			setLoading(false);
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}
	};

	return (
		<MainStack
			justifyContent="center"
			alignItems="center"
			minHeight="100%"
		>
			<Image
				position="absolute"
				zIndex={0}
				width={width}
				height={height}
				blurRadius={3}
				src={require('../../assets/images/map_background.png')}
			/>

			<Button
				position="absolute"
				zIndex={1}
				borderColor="#333"
				icon={Plus}
				onPress={readImgs}
			>
				Choose journeys
			</Button>

			<LoadingModal
				navigation={navigation}
				loading={loading}
			/>
			<JourneysModal
				navigation={navigation}
				journeys={journeys}
				openJourneySelect={(index: number) => {
					if(!journeys) { return }
					setJourneys(null);
					setJourney( journeys[index] );
				}}
				openManualSelect={() => {
					setJourneys(null);
					setSelect(true);
				}}
			/>
			<JourneyModal
				navigation={navigation}
				journey={journey}
				cancel={() => setJourney(null)}
				create={(l) => {
					setJourney(null);
					createMap(l || images || []);
				}}
			/>
			<SelectModal
				navigation={navigation}
				open={select}
				images={images}
				cancel={() => setSelect(false)}
				create={(l) => {
					setSelect(false);
					createMap(l || images || []);
				}}
			/>
		</MainStack>
	);
};
