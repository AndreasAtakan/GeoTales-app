import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	H3,
	Button,
	XStack,
	XGroup,
	Spinner,
	Sheet,
	Card,
	Image
} from "tamagui";

//import getdate from "../../utils/getdate";

type SelectModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	open: boolean;
	images: any[] | null;
	cancel: () => void;
	create: (l: any[] | null) => void;
};

export const SelectModal: FC<SelectModalProps> = ({ navigation, open, images, cancel, create }) => {
	const { height, width } = useWindowDimensions();
	const w = width / 2 - 20;

	return (
		<Sheet
			forceRemoveScrollEnabled={open}
			modal={true}
			open={open}
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
						onPress={() => create(null)}
					>
						Add to map
					</Button>
				</XGroup>
				<FlatList
					contentContainerStyle={{ paddingBottom: 70 }}
					alwaysBounceVertical={false}
					pinchGestureEnabled={false}
					numColumns={2}
					data={images}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => {
						const r = item.image.width / item.image.height;
						let h = w / r;

						return (
							<Image
								br={4}
								width={w}
								height={h}
								resizeMode="contain"
								als="center"
								src={item.image.uri}
								marginVertical={10}
								marginHorizontal={10}
								//animation="quick"
								//pressStyle={{ opacity: 0.8 }}
								//onPress={() => openJourneySelect(c++)}
							/>
						);
					}}
				/>
			</Sheet.Frame>
		</Sheet>
	);
};
