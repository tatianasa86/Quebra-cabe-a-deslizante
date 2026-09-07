export type DifficultySize = 3 | 4 | 5;

export interface ThemeItem {
  id: string;
  name: string;
  title: string;
  url: string;
  thumb: string;
  isCustom?: boolean;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  email?: string;
  accountType?: 'guest' | 'local' | 'google';
  photoUrl?: string;
}

export type ScreenType = 'welcome' | 'game';
