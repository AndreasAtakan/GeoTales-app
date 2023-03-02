import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
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

type JourneysModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	journeys: any[] | null;
	openJourneySelect: (index: number) => void;
	openManualSelect: () => void;
};

export const JourneysModal: FC<JourneysModalProps> = ({ navigation, journeys, openJourneySelect, openManualSelect }) => {
	const { height, width } = useWindowDimensions();
	const w = width / 2 - 20;
	let c = 0;

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
				<Button
					w="90%"
					bc="$blue6Light"
					color="$gray11Light"
					size="$4"
					marginVertical={15}
					onPress={openManualSelect}
				>
					Select manually
				</Button>
				<FlatList
					contentContainerStyle={{ paddingBottom: 70 }}
					alwaysBounceVertical={false}
					pinchGestureEnabled={false}
					numColumns={2}
					data={journeys}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => {
						let f = item[0], l = item[ item.length - 1 ];

						const r = f.image.width / f.image.height;
						let h = w / r;

						return (
							<Card
								theme="light"
								width={w}
								height={h}
								elevate={true}
								marginVertical={10}
								marginHorizontal={10}
								animation="quick"
								pressStyle={{ opacity: 0.8 }}
								onPress={() => openJourneySelect(c++)}
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
										resizeMode="contain"
										als="center"
										src={f.image.uri}
										blurRadius={6}
									/>
								</Card.Background>
							</Card>
						);
					}}
				/>
			</Sheet.Frame>
		</Sheet>
	);
};
