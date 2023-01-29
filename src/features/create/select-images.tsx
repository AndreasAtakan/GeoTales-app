import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Alert } from 'react-native';
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

import * as ImagePicker from 'expo-image-picker';
import { pres_from_exif } from "../../autopres/autopres";
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

		if (res && !res.canceled) {
			let pres = pres_from_exif(res.assets);
			console.log(pres);
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
