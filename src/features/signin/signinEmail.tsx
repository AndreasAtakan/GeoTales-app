import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useContext } from "react";
//import { Alert } from 'react-native';
import { Button } from "tamagui";
import { Mail } from "@tamagui/lucide-icons";

import { AuthContext } from "../../context";

type SigninEmailProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"signin",
		undefined
	>;
};

export const SigninEmail: FC<SigninEmailProps> = ({ navigation }) => {
	const { signIn } = useContext(AuthContext);
	const signin = async () => {
		console.log("E-mail signin");
		if(signIn) { signIn(); }
	};

	return (
		<Button
			themeInverse
			size="$5"
			bc="#808080"
			color="#e6e6e6"
			onPress={signin}
			als="center"
			width="80%"
			icon={Mail}
		>
			Log in with e-mail
		</Button>
	);
};
