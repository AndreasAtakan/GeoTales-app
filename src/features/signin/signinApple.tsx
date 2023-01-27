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
	marginTop: number;
};

export const SigninApple: FC<SigninAppleProps> = ({ navigation, marginTop }) => {
	const { signIn } = useContext(AuthContext);
	const signin = async () => {
		console.log("Apple signin");
		if(signIn) { signIn(); }
	};

	return (
		<Button
			themeInverse
			bc="#333333"
			color="#e6e6e6"
			onPress={signin}
			width="100%"
			icon={Apple}
			marginTop={marginTop}
		>
			Sign in with Apple
		</Button>
	);
};
