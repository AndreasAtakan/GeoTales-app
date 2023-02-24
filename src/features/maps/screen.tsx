import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useState, useEffect } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	H2,
	Card,
	Text,
	Separator,
	YGroup,
	YStack,
	Spinner,
	Image
} from "tamagui";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { headerColor } from "../../constants/colors";

import { MainStack } from "../../components/MainStack";
import getdate from "../../utils/getdate";
import { Fab } from "./fab";

export const MapsScreen: FC< NativeStackScreenProps<StackNavigatorParams, "maps"> > = ({ navigation }) => {
	const goto = (id: string) => navigation.navigate("view", { id });

	const { height, width } = useWindowDimensions();

	const [ loading, setLoading ] = useState<boolean>(true);
	const [ list, setList ] = useState<any>(null);

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
				alwaysBounceVertical={false}
				pinchGestureEnabled={false}
				ListEmptyComponent={
					loading ?
					( <Spinner size="large" color={headerColor} marginTop={50} /> )
					:
					( <Text color="#999" marginTop={50}>No maps</Text> )
				}
				data={list}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<Card
						theme="light"
						width={width - 20}
						height={width / item.imgs[0].ratio || 600}
						elevate={true}
						marginVertical={15}
						marginHorizontal={10}
						animation="quick"
						pressStyle={{ opacity: 0.8 }}
						onPress={() => goto(item.id)}
					>
						<Card.Header
							ai="center"
							marginTop={30}
						>
							<H2 color="#e6e6e6">
								{`${getdate(item.imgs[0].timestamp)} – ${getdate(item.imgs[ item.imgs.length - 1 ].timestamp)}`}
							</H2>
						</Card.Header>
						<Card.Background>
							<Image
								width={width}
								height={width / item.imgs[0].ratio || 600}
								resizeMode="contain"
								als="center"
								src={item.imgs[0].uri}
								blurRadius={10}
							/>
						</Card.Background>
					</Card>
				)}
			/>
			<Fab navigation={navigation} />
		</MainStack>
	);
};

/*

<YStack
	f={1}
	jc={list ? "flex-start" : "center"}
	ai="center"
	height={list ? "auto" : 250}
>
	{
		loading ?
		(
			<Spinner size="large" color={headerColor} />
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

*/
