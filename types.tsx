/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootDrawerParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootDrawerParamList = {
  Maps: undefined;
  Profile: undefined;
  Settings: undefined;
  About: undefined;
  Legal: undefined;
};

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> = CompositeScreenProps<
  DrawerScreenProps<RootDrawerParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
