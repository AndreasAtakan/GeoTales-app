import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";

import { fabColor } from "../../constants/colors";

type FabProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"maps",
		undefined
	>;
};

export const Fab: FC<FabProps> = ({ navigation }) => {
	const goto = () => navigation.navigate("create");

	return (
		<Button
			bc={fabColor}
			color="#e6e6e6"
			br={100}
			width={65}
			height={65}
			onPress={goto}
			icon={<Plus size={32} strokeWidth={3} />}
			position="absolute"
			bottom={20}
			right={20}
			elevation={10}
		/>
	);
};
