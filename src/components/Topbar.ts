import { styled, YStack } from "tamagui";

import { headerColor } from "../constants/colors";

export const Topbar = styled(YStack, {
	name: "Topbar",
	backgroundColor: headerColor,
	width: "100%",
	height: "$7",
	padding: "$4"
});
