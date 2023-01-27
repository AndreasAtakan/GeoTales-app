import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import {
	Anchor,
	H1,
	ListItem,
	Paragraph,
	Separator,
	YGroup,
	YStack
} from "tamagui";

import { MainStack } from "../../components/MainStack";
import { SigninApple } from "./signinApple";
import { SigninGoogle } from "./signinGoogle";
import { SigninEmail } from "./signinEmail";

export const SignInScreen: FC< NativeStackScreenProps<StackNavigatorParams, "signin"> > = ({ navigation }) => {
	return (
		<MainStack padding="$4">
			<YStack space="$5">
				<SigninApple navigation={navigation} marginTop={80} />
				<SigninGoogle navigation={navigation} />
				<SigninEmail navigation={navigation} />
			</YStack>
		</MainStack>
	);
};
