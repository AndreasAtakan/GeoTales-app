import { NavigationContainer } from "@react-navigation/native";
import { Suspense, useReducer, useEffect } from "react";
import { TamaguiProvider } from "tamagui";

import { AuthContext } from "../context";

import config from "../tamagui.config";

export const Provider: FCC = ({ children }) => {
	const [ state, dispatch ] = useReducer(stateReducer, { signedIn: false });

	// NOTE: https://docs.expo.dev/versions/latest/sdk/apple-authentication/#installation
	const signIn = async (data?: any) => {
		// In a production app, we need to send some data (usually username, password) to server and get a token
		// We will also need to handle errors if sign in failed
		// After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
		// In the example, we'll use a dummy token

		dispatch({ type: 'signin', token: 'dummy-auth-token' });
	};
	const signOut = () => dispatch({ type: 'signout' });
	const signUp = async (data?: any) => {
		// In a production app, we need to send user data to server and get a token
		// We will also need to handle errors if sign up failed
		// After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
		// In the example, we'll use a dummy token

		dispatch({ type: 'signup', token: 'dummy-auth-token' });
	};

	useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		// https://docs.expo.dev/versions/latest/sdk/securestore/
		const bootstrapAsync = async () => {
			let userToken;

			try {
				// Restore token stored in `SecureStore` or any other encrypted storage
				// userToken = await SecureStore.getItemAsync('userToken');
			} catch(e) {
				// Restoring token failed
			}

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			dispatch({ type: 'restore', token: userToken });
		};

		bootstrapAsync();
	}, []);

	return (
		<TamaguiProvider config={config}>
			<Suspense>
				<AuthContext.Provider value={{
					...state,
					signIn,
					signOut,
					signUp
				}}>
					<NavigationContainer>{children}</NavigationContainer>
				</AuthContext.Provider>
			</Suspense>
		</TamaguiProvider>
	);
};

const stateReducer = (state: any, action: any) => {
	switch(action.type) {
		case 'signin': { return { ...state, signedIn: true }; }
		case 'signout': { return { ...state, signedIn: false }; }
		case 'signup': { return { ...state, signedIn: false }; }
		case 'restore': { return state; }
		default: { throw Error('Unknown action: ' + action.type); }
	}
};
