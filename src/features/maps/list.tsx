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
	list: string[];
};

export const List: FC<ListProps> = ({ navigation, list }) => {
	const goto = (id: string) => navigation.navigate("view", { id });
	let c = 1;

	return (
		<YGroup
			separator={<Separator />}
			//space="$3"
		>
			{list.map((id: string) => (
				<ListItem
					key={id}
					hoverTheme={true}
					pressTheme={true}
					title={`Map ${c++}`}
					subTitle="Description"
					icon={MapIcon}
					iconAfter={ChevronRight}
					onPress={() => goto(id)}
				/>
			))}
		</YGroup>
	);
};
