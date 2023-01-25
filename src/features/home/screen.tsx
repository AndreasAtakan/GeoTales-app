import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Twitter, Facebook } from "@tamagui/lucide-icons";
import { FC } from "react";
import {
	Anchor,
	H1,
	ListItem,
	Paragraph,
	Separator,
	YGroup,
	YStack
} from "tamagui";

import { MyStack } from "../../components/MyStack";
import { LinkToUser } from "./link-to-user";
import { SelectImages } from "./select-images";

export const HomeScreen: FC<
	NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation }) => {
	return (
		<MyStack>
			<YStack space="$4" >
				<H1 textAlign="center">GeoTales demo</H1>

				<Paragraph textAlign="center">
					Select image and get gps data
				</Paragraph>

				<LinkToUser navigation={navigation} />
				<SelectImages navigation={navigation} />

				<YGroup
					width="100%"
					separator={<Separator />}
				>
					<ListItem icon={Twitter}>
						<Anchor
							href="https://twitter.com/Geotales_io"
							target="_blank"
						>
							@Geotales_io
						</Anchor>
					</ListItem>
					<ListItem icon={Facebook}>
						<Anchor
							href="https://www.facebook.com/Geotales-107125105285825"
							target="_blank"
							rel="noreferrer"
						>
							GeoTales
						</Anchor>
					</ListItem>
				</YGroup>
			</YStack>
		</MyStack>
	);
};
