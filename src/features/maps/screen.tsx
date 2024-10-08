import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useState, useEffect } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	H3,
	Card,
	Text,
	Spinner,
	Image
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { headerColor } from "../../constants/colors";

import { MainStack } from "../../components/MainStack";
import getdate from "../../utils/getdate";
import { Fab } from "./fab";

export const MapsScreen: FC< NativeStackScreenProps<StackNavigatorParams, "maps"> > = ({ navigation }) => {
	const { height, width } = useWindowDimensions();
	const w = width / 2 - 12;

	const [ loading, setLoading ] = useState<boolean>(true);
	const [ list, setList ] = useState<any>(null);

	const goto = (id: string) => navigation.navigate("view", { id });

	/*AsyncStorage.clear()
	.then(() => console.log("Cleared"))
	.catch(err => console.error(err));*/

	useEffect(() => {
		// DOCS: https://react-native-async-storage.github.io/async-storage/docs/api/#getallkeys
		AsyncStorage.getAllKeys((err, ids) => {
			if(err || !ids) { console.error(err); return; }
			AsyncStorage.multiGet(ids, (err, res) => {
				if(err || !res) { console.error(err); return; }

				setList(
					res
					.map(p => { return { id: p[0], ...JSON.parse(p[1] || "{}") }; })
					.filter(p => !!p.imgs)
				);
				setLoading(false);
			});
		});

		//
	}, []);

	return (
		<MainStack
			jc="center"
			ai="center"
		>
			<FlatList
				contentContainerStyle={{ paddingBottom: 70 }}
				alwaysBounceVertical={false}
				pinchGestureEnabled={false}
				ListEmptyComponent={
					loading ?
					( <Spinner size="large" color={headerColor} marginTop={50} /> )
					:
					( <Text color="#999" marginTop={50}>No maps</Text> )
				}
				numColumns={2}
				data={list}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => {
					let f = item.imgs[0], l = item.imgs[ item.imgs.length - 1 ],
						h = Math.min( w , 350);

					return (
						<Card
							theme="light"
							width={w}
							height={h}
							elevate={true}
							marginVertical={10}
							marginHorizontal={6}
							animation="quick"
							pressStyle={{ opacity: 0.8 }}
							onPress={() => goto(item.id)}
						>
							<Card.Header
								ai="center"
								marginTop={30}
							>
								<H3 color="#e6e6e6">
									{`${getdate(f.timestamp)} – ${getdate(l.timestamp)}`}
								</H3>
							</Card.Header>
							<Card.Background>
								<Image
									br={4}
									width={w}
									height={h}
									resizeMode="cover"
									als="center"
									src={f.uri}
									blurRadius={6}
								/>
							</Card.Background>
						</Card>
					);
				}}
			/>
			<Fab navigation={navigation} />
		</MainStack>
	);
};
