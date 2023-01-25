import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Button } from "tamagui";

import * as ImagePicker from 'expo-image-picker';
//import * as DocumentPicker from 'expo-document-picker';
//import Exif from '@notech/react-native-exif';

type SelectImagesProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"home",
		undefined
	>;
};

export const SelectImages: FC<SelectImagesProps> = ({ navigation }) => {
	const readImgs = async () => {
		let res = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true,
			exif: true,
			selectionLimit: 5
		});

		if(!res.canceled) {
			let i = res.assets[0];
			alert( JSON.stringify(i.exif, null, 2) );
			// NOTE: GPS dataen ligger under 'GPSLatitude' og 'GPSLongitude'
			// Her er docs for biblioteket jeg brukte: https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickerasset
		}else{
			alert( "error" );
		}
	};

	return (
		<Button
			themeInverse
			onPress={readImgs}
			width="100%"
		>
			Choose images
		</Button>
	);
};
