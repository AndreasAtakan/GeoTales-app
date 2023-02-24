import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useState } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	H3,
	Button,
	XStack,
	Spinner,
	Sheet,
	Card,
	Image
} from "tamagui";

import getdate from "../../utils/getdate";

type JourneyModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	journeys: any[] | null;
};

export const JourneyModal: FC<JourneyModalProps> = ({ navigation, journeys }) => {
	const { height, width } = useWindowDimensions();
	const w = width / 2 - 20,
		  h = 300;

	return (
		<Sheet
			forceRemoveScrollEnabled={!!journeys}
			modal={true}
			open={!!journeys}
			snapPoints={[90]}
			disableDrag={true}
			dismissOnSnapToBottom={false}
			dismissOnOverlayPress={false}
		>
			<Sheet.Overlay />
			<Sheet.Frame
				f={1}
				//jc="center"
				ai="center"
			>
				<FlatList
					alwaysBounceVertical={false}
					pinchGestureEnabled={false}
					numColumns={2}
					data={journeys}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<Card
							theme="light"
							width={w}
							height={h}
							elevate={true}
							marginVertical={15}
							marginHorizontal={10}
							animation="quick"
							pressStyle={{ opacity: 0.8 }}
							//onPress={() => goto(item.id)}
						>
							<Card.Header
								ai="center"
								marginTop={30}
							>
								<H3 color="#e6e6e6">
									{`${getdate(item[0].timestamp)} – ${getdate(item[ item.length - 1 ].timestamp)}`}
								</H3>
							</Card.Header>
							<Card.Background>
								<Image
									br={4}
									width={w}
									height={h}
									resizeMode="contain"
									als="center"
									src={item[0].image.uri}
									blurRadius={10}
								/>
							</Card.Background>
						</Card>
					)}
				/>
			</Sheet.Frame>
		</Sheet>
	);
};
