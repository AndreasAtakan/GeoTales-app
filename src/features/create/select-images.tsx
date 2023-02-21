import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

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

	const status = await PermissionsAndroid.request(permission);
	return status === 'granted';
}

export const SelectImages: FC<SelectImagesProps> = ({ navigation }) => {
	const readImgs = async () => {
		if(Platform.OS === "android" && !(await hasAndroidPermission())) { return; }

		let res;
		try {
			// DOCS: https://github.com/react-native-cameraroll/react-native-cameraroll
			res = await CameraRoll.getPhotos({
				first: 1000,
				assetType: "All",
				include: [ "location", "imageSize" ]
			});
		}catch(err) {
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}

		console.log( res );

		/*if(res && !res.didCancel && res.assets) {
			let pres = new Pres();
			await pres.initialize(res.assets, 10, [8, 50]);

			const id = uuid();
			try {
				await AsyncStorage.setItem( id, JSON.stringify(pres) );
				navigation.replace("view", { id });
			}
			catch(err) { console.error(err); }
		}*/
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
