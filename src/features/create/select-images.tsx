import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Alert } from 'react-native';
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";

import uuid from "../../utils/uuid";
import { Pres } from "../../autopres";

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
			// Docs: https://github.com/react-native-image-picker/react-native-image-picker
			res = await ImagePicker.launchImageLibrary({
				selectionLimit: 50,
				//presentationStyle: "popover", // https://github.com/react-native-image-picker/react-native-image-picker#options
				mediaType: 'mixed',
				includeExtra: true
			});
		}
		catch(err) {
			Alert.alert('Error', `${err}`, [ { text: 'OK', onPress: () => console.log('OK') } ]);
		}

		if(res && !res.didCancel && res.assets) {
			let pres = new Pres();
			await pres.initialize(res.assets, 10);

			const id = uuid();
			try {
				await AsyncStorage.setItem( id, JSON.stringify(pres) );
				navigation.replace("view", { id });
			}
			catch(err) { console.error(err); }
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
