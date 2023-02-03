import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { ScrollView } from "react-native";
import {
	ListItem,
	Text,
	Separator,
	YGroup,
	YStack
} from "tamagui";

import { MainStack } from "../../components/MainStack";
import { List } from "./list";
import { Fab } from "./fab";

let l: number[] = []; for(let i = 0; i < 5; i++) { l.push(i); }

export const MapsScreen: FC< NativeStackScreenProps<StackNavigatorParams, "maps"> > = ({ navigation }) => {
	return (
		<MainStack>
			<ScrollView
				alwaysBounceVertical={false}
				pinchGestureEnabled={false}
			>
				<YStack
					f={1}
					jc={l.length > 0 ? "flex-start" : "center"}
					ai="center"
					height={l.length > 0 ? "auto" : 250}
				>
					{l.length > 0 ? (
						<List navigation={navigation} list={l} />
					) : 
					(
						<Text color="#999">No maps found</Text>
					)}
				</YStack>
			</ScrollView>
			<Fab navigation={navigation} />
		</MainStack>
	);
};
