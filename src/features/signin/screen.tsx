import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { Dimensions } from 'react-native';
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
				<SigninApple navigation={navigation} top={80} />
				<SigninGoogle navigation={navigation} top={150} />
				<SigninEmail navigation={navigation} top={240} />
			</YStack>
		</MainStack>
	);
};
