import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC, useContext } from "react";

import { headerColor } from "../constants/colors";
import { AuthContext } from "../context";

import { UserDropdown } from "../components/UserDropdown";

import { SignInScreen } from "../features/signin/screen";
import { MapsScreen } from "../features/maps/screen";
import { CreateScreen } from "../features/create/screen";

const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const NativeNavigation: FC = () => {
	const { signedIn } = useContext(AuthContext);

	// NOTE: https://reactnavigation.org/docs/native-stack-navigator/#options
	return (
		<Stack.Navigator
			screenOptions={{
				title: "",
				headerStyle: {
					backgroundColor: headerColor
				},
				headerTintColor: '#fff',
				headerBackTitle: "",
				headerBackTitleVisible: false,
				headerShadowVisible: true,
				headerTitleAlign: 'center',
				headerRight: UserDropdown
			}}
		>
			{
				signedIn ? (
				<>
					<Stack.Screen
						options={{
							title: "My maps"
						}}
						name="maps"
						component={MapsScreen}
					/>
					<Stack.Screen
						options={{
							title: "Create new map",
							headerRight: () => null
						}}
						name="create"
						component={CreateScreen}
					/>
				</>
				) :
				(
					<Stack.Screen
						options={{
							//headerShown: false
							//animationTypeForReplace: isSignout ? 'pop' : 'push'
							headerRight: () => null
						}}
						name="signin"
						component={SignInScreen}
					/>
				)
			}
		</Stack.Navigator>
	);
};
