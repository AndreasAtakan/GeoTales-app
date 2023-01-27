import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useContext } from "react";
//import { Alert } from 'react-native';
import { Button } from "tamagui";
//import { Google } from "@tamagui/lucide-icons";

import { AuthContext } from "../../context";

type SigninGoogleProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"signin",
		undefined
	>;
};

export const SigninGoogle: FC<SigninGoogleProps> = ({ navigation }) => {
	const { signIn } = useContext(AuthContext);
	const signin = async () => {
		console.log("Google signin");
		if(signIn) { signIn(); }
	};

	return (
		<Button
			themeInverse
			bc="#d0463b"
			color="#e6e6e6"
			onPress={signin}
			width="100%"
		>
			Sign in with Google
		</Button>
	);
};
