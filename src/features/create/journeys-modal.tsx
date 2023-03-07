import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	H3,
	Button,
	Sheet,
	Card,
	Image,
	XGroup
} from "tamagui";

import getdate from "../../utils/getdate";

type JourneysModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	journeys: boolean;
	trips: any[] | null;
	cancel: () => void;
	openJourneySelect: (index: number) => void;
	openManualSelect: () => void;
};

export const JourneysModal: FC<JourneysModalProps> = ({ navigation, journeys, trips, cancel, openJourneySelect, openManualSelect }) => {
	const { height, width } = useWindowDimensions();
	const w = width / 2 - 20;

	return (
		<Sheet
			forceRemoveScrollEnabled={journeys}
			modal={true}
			open={journeys}
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
				<XGroup
					w="100%"
					marginVertical={15}
				>
					<Button
						w={0.3 * width - 10}
						size="$4"
						marginLeft={10}
						onPress={cancel}
					>
						Cancel
					</Button>
					<Button
						w={0.7 * width - 10}
						size="$4"
						bc="$blue6Light"
						color="$gray11Light"
						marginRight={10}
						onPress={openManualSelect}
					>
						Select manually
					</Button>
				</XGroup>
				<FlatList
					contentContainerStyle={{ paddingBottom: 70 }}
					alwaysBounceVertical={false}
					pinchGestureEnabled={false}
					numColumns={2}
					data={trips}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => {
						let f = item[0], l = item[ item.length - 1 ],
							h = Math.min( w , 250);

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
								onPress={() => openJourneySelect(index)}
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
										src={f.image.uri}
										blurRadius={2}
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
