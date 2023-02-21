import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";

import uuid from "../../utils/uuid";
import { Pres } from "../../autopres";

type SelectImagesProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
};

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

export const SelectImages: FC<SelectImagesProps> = ({ navigation }) => {
	const readImgs = async () => {
		if(Platform.OS === "android" && !(await hasAndroidPermission())) {
			navigation.popToTop();
			return;
		}

		let res;
		try {
			// DOCS: https://github.com/react-native-cameraroll/react-native-cameraroll
			res = await CameraRoll.getPhotos({
				first: 10000,
				assetType: "All",
				include: [ "location", "imageSize" ]
			});

			//console.log( res.page_info, res.edges.length );
			let images = res.edges.filter((v: PhotoIdentifier) => !!v.node.location).map((v: PhotoIdentifier) => v.node);
			console.log( images.length );

			// TODO: Build up suggested journies and make UI so that the user can select a journey and choose cluster-size – d
			return;

			let pres = new Pres();
			await pres.initialize(images, 10, [8, 50]);

			const id = uuid();
			await AsyncStorage.setItem( id, JSON.stringify(pres) );
			navigation.replace("view", { id });
		}
		catch(err) {
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}
	};

	return (
		<Button
			position="absolute"
			zIndex={1}
			borderColor="#333"
			icon={Plus}
			onPress={readImgs}
		>
			Choose images
		</Button>
	);
};
