import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import {
	Text,
	YGroup,
	YStack
} from "tamagui";

import { MainStack } from "../../components/MainStack";
import { SelectImages } from "./select-images";

// TODO: https://github.com/rnmapbox/maps

export const CreateScreen: FC< NativeStackScreenProps<StackNavigatorParams, "create"> > = ({ navigation }) => {
	return (
		<MainStack>
			<YStack
				justifyContent="center"
				alignItems="center"
				minHeight="100%"
			>
				<SelectImages navigation={navigation} />
			</YStack>
		</MainStack>
	);
};
