import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useContext } from "react";
//import { Alert } from 'react-native';
import { Button } from "tamagui";
import { Apple } from "@tamagui/lucide-icons";

import { AuthContext } from "../../context";

type SigninAppleProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"signin",
		undefined
	>;
	top: number;
};

export const SigninApple: FC<SigninAppleProps> = ({ navigation, top }) => {
	const { signIn } = useContext(AuthContext);
	const signin = async () => {
		console.log("Apple signin");
		if(signIn) { signIn(); }
	};

	return (
		<Button
			themeInverse
			position="absolute"
			zIndex={1}
			size="$5"
			bc="#333333"
			color="#e6e6e6"
			onPress={signin}
			width="95%"
			icon={Apple}
			top={top}
		>
			Sign in with Apple
		</Button>
	);
};
