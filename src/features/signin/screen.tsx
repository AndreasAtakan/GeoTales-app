import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useWindowDimensions } from "react-native";
import {
	Anchor,
	H1,
	ListItem,
	Paragraph,
	Separator,
	YGroup,
	YStack,
	Image
} from "tamagui";

import { MainStack } from "../../components/MainStack";
import { SigninApple } from "./signinApple";
import { SigninGoogle } from "./signinGoogle";
import { SigninEmail } from "./signinEmail";

export const SignInScreen: FC< NativeStackScreenProps<StackNavigatorParams, "signin"> > = ({ navigation }) => {
	const { height, width } = useWindowDimensions();

	return (
		<MainStack
			justifyContent="center"
			alignItems="center"
			minHeight="100%"
		>
			<Image
				src={require('../../assets/images/map_background.png')}
				width={width}
				height={height}
				blurRadius={3}
				position="absolute"
				zIndex={0}
			/>
			<SigninApple navigation={navigation} top={30} />
			<SigninGoogle navigation={navigation} top={100} />
			<SigninEmail navigation={navigation} top={190} />
		</MainStack>
	);
};
