import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
//import { useWindowDimensions } from "react-native";
import {
	Spinner,
	Sheet
} from "tamagui";

import { headerColor } from "../../constants/colors";

type LoadingModalProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"create",
		undefined
	>;
	loading: boolean;
};

export const LoadingModal: FC<LoadingModalProps> = ({ navigation, loading }) => {
	//const { height, width } = useWindowDimensions();

	return (
		<Sheet
			forceRemoveScrollEnabled={loading}
			modal={true}
			open={loading}
			snapPoints={[20]}
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
				<Spinner size="large" color={headerColor} p="$4" />
			</Sheet.Frame>
		</Sheet>
	);
};
