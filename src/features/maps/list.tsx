import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FC } from "react";
import { ChevronRight, Map as MapIcon } from "@tamagui/lucide-icons";
import {
	ListItem,
	Separator,
	YGroup
} from "tamagui";

type ListProps = {
	navigation: NativeStackNavigationProp<
		StackNavigatorParams,
		"maps",
		undefined
	>;
	list: any;
};

export const List: FC<ListProps> = ({ navigation, list }) => {
	const goto = async (id: any) => {
		navigation.navigate("view", { id });
	};

	return (
		<YGroup
			separator={<Separator />}
			//space="$3"
		>
			{list.map((v: any) => (
				<ListItem
					key={v}
					hoverTheme
					pressTheme
					title={`Map ${v+1}`}
					subTitle="Description"
					icon={MapIcon}
					iconAfter={ChevronRight}
					onPress={() => goto(v.toString())}
				/>
			))}
		</YGroup>
	);
};
