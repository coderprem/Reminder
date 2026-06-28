export const ScreenNames = {
  HOME: 'Home',
  SEARCH: 'Search',
} as const;

export type ScreenName = (typeof ScreenNames)[keyof typeof ScreenNames];


export const NavigatorNames = {
  ROOT: 'Root',
  TABS: 'Tabs',
} as const;