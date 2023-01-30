import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useContext, useState } from 'react'
import {
	Button,
	Sheet,
	XStack,
	YGroup
} from "tamagui";
import { User, Settings, LogOut } from "@tamagui/lucide-icons";

import { AuthContext } from "../context";

import { headerColor } from "../constants/colors";

type UserMenuProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		any,
		undefined
	>;
};

// NOTE: I don't hava access to 'navigation' because UserMenu is used in Stack.Navigator and not on a screen-view
//		 Potentially a big problem, todo fix
export const UserMenu: any /*FC<UserMenuProps>*/ = (/*{ navigation }*/) => {
	const [ open, setOpen ] = useState(false);

	const { signOut } = useContext(AuthContext);
	const signout = async () => {
		console.log("Signout");
		if(signOut) { signOut(); }
		setOpen(false);
	};

	const gotoSettings = () => {
		//navigation.navigate("settings");
		setOpen(false);
	};

	const gotoProfile = () => {
		//navigation.navigate("profile");
		setOpen(false);
	};

	return (
		<>
			<Button
				bc="#f2f2f2"
				color={headerColor}
				height="90%"
				minHeight={30}
				paddingHorizontal={10}
				paddingVertical={5}
				icon={<User size={26} strokeWidth={3} />}
				onPress={() => setOpen(true)}
			/>

			<Sheet
				forceRemoveScrollEnabled={open}
				modal={true}
				open={open}
				onOpenChange={setOpen}
				snapPoints={[50, 30]}
				dismissOnSnapToBottom
			>
				<Sheet.Overlay />
				<Sheet.Frame
					f={1}
					p="$4"
					//jc="center"
					ai="center"
					space="$5"
				>
					<Button
						size="$5"
						width="100%"
						icon={User}
						onPress={gotoProfile}
					>
						My profile
					</Button>

					<Button
						size="$5"
						width="100%"
						icon={Settings}
						onPress={gotoSettings}
					>
						Settings
					</Button>

					<Button
						themeInverse
						size="$4"
						width="60%"
						bc="#e60000"
						color="#f2f2f2"
						marginTop={60}
						icon={LogOut}
						onPress={signout}
					>
						Sign out
					</Button>
				</Sheet.Frame>
			</Sheet>
		</>
	);
};
