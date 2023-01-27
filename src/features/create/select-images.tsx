import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Alert } from 'react-native';
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

import * as ImagePicker from 'expo-image-picker';
//import * as DocumentPicker from 'expo-document-picker';
//import Exif from '@notech/react-native-exif';

type SelectImagesProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
};

export const SelectImages: FC<SelectImagesProps> = ({ navigation }) => {
	const readImgs = async () => {
		let res;
		try {
			res = await ImagePicker.launchImageLibraryAsync({
				allowsMultipleSelection: true,
				exif: true,
				selectionLimit: 50
			});
		}
		catch(err) {
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}

		if(res && !res.canceled) {
			let i = res.assets[0];

			/*
				Alert.alert('EXIF data', JSON.stringify(i.exif, null, 2), [
					{
						text: 'Cancel',
						onPress: () => console.log('Cancel'),
						style: 'cancel'
					},
					{ text: 'OK', onPress: () => console.log('OK') }
				]);
			*/
			// NOTE: GPS dataen ligger under 'GPSLatitude' og 'GPSLongitude'
			// Her er docs for biblioteket jeg brukte: https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickerasset

			if(!i.exif) { return; }
			let lat = i.exif.GPSLatitude, lng = i.exif.GPSLongitude;
			Alert.alert('GPS', `lat: ${lat}, lng: ${lng}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}
	};

	return (
		<Button
			borderColor="#333"
			icon={Plus}
			onPress={readImgs}
		>
			Choose images
		</Button>
	);
};
