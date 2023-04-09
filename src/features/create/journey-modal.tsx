import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC, useState } from "react";
import { useWindowDimensions, FlatList } from "react-native";
import {
	Card,
	Button,
	XGroup,
	Sheet,
	Image
} from "tamagui";
import { XCircle } from "@tamagui/lucide-icons";

//import getdate from "../../utils/getdate";
import { Img } from "../../autopres";

type JourneyModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	journey: Img[] | null;
	back: () => void;
	create: (l: Img[]) => void;
};

export const JourneyModal: FC<JourneyModalProps> = ({ navigation, journey, back, create }) => {
	const { height, width } = useWindowDimensions();
	const d = width / 2 - 6;

	const [ selected, setSelected ] = useState<boolean[]>( Array( journey?.length ).fill(true) );

	let toggle = (index: number) => {
		let s = [...selected];
		s[index] = !s[index];
		setSelected(s);
	};

	return (
		<Sheet
			forceRemoveScrollEnabled={!!journey}
			modal={true}
			open={!!journey}
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
						onPress={back}
					>
						Back
					</Button>
					<Button
						w={0.7 * width - 10}
						size="$4"
						bc="$blue6Light"
						color="$gray11Light"
						marginRight={10}
						onPress={() => create(
							(journey || []).filter((e,i) => selected[i])
						)}
					>
						Add to map
					</Button>
				</XGroup>
				<FlatList
					contentContainerStyle={{ paddingBottom: 70 }}
					alwaysBounceVertical={false}
					pinchGestureEnabled={false}
					numColumns={2}
					data={journey}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<Card
							theme="light"
							width={d}
							height={d}
							elevate={true}
							marginVertical={3}
							marginHorizontal={3}
							animation="quick"
							pressStyle={{ opacity: 0.8 }}
							onPress={() => toggle(index)}
						>
							{!selected[index] && (
								<Card.Footer padded>
									<XCircle size={25} color="white" />
								</Card.Footer>
							)}
							<Card.Background>
								<Image
									br={4}
									width={d}
									height={d}
									resizeMode="cover"
									als="center"
									src={item.uri}
									blurRadius={selected[index] ? 0 : 8}
								/>
							</Card.Background>
						</Card>
					)}
				/>
			</Sheet.Frame>
		</Sheet>
	);
};
