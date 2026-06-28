import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import type { RootStackParamList } from '../paramsList/RootStackParamList';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type NavigateFn = {
  (name: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]): void;
};

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
): void {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as NavigateFn)(name, params);
  }
}

export function goBack(): void {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function replace<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      StackActions.replace(name as string, params as object | undefined)
    );
  }
}

export function reset<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: name as string, params: params as object | undefined }],
      })
    );
  }
}

export function push<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      StackActions.push(name as string, params as object | undefined)
    );
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

export function setParams(params: object): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.setParams(params));
  }
}
