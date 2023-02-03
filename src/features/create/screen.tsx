import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { Dimensions } from 'react-native';
import {
	Text,
	Image,
	YGroup,
	YStack
} from "tamagui";

import { MainStack } from "../../components/MainStack";
import { SelectImages } from "./select-images";

export const CreateScreen: FC< NativeStackScreenProps<StackNavigatorParams, "create"> > = ({ navigation }) => {
	const windowWidth = Dimensions.get('window').width,
		  windowHeight = Dimensions.get('window').height;

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
