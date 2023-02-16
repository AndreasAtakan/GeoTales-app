import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
	ListItem,
	Text,
	Separator,
	YGroup,
	YStack,
	Spinner
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { MainStack } from "../../components/MainStack";
import { List } from "./list";
import { Fab } from "./fab";

export const MapsScreen: FC< NativeStackScreenProps<StackNavigatorParams, "maps"> > = ({ navigation }) => {
	const [ loading, setLoading ] = useState<boolean>(true);
	const [ list, setList ] = useState<any>(null);

	useEffect(() => {
		// DOCS: https://react-native-async-storage.github.io/async-storage/docs/api/#getallkeys
		AsyncStorage.getAllKeys()
		.then(ids => {
			setList(ids);
			setLoading(false);
		})
		.catch(err => console.error(err));

		//
	}, []);

	return (
		<MainStack>
			<ScrollView
				alwaysBounceVertical={false}
				pinchGestureEnabled={false}
			>
				<YStack
					f={1}
					jc={list ? "flex-start" : "center"}
					ai="center"
					height={list ? "auto" : 250}
				>
					{
						loading ?
						(
							<Spinner size="large" color="#eba937" />
						) :
						(
							list ?
							(
								<List navigation={navigation} list={list} />
							) :
							(
								<Text color="#999">No maps found</Text>
							)
						)
					}
				</YStack>
			</ScrollView>
			<Fab navigation={navigation} />
		</MainStack>
	);
};
