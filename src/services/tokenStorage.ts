import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'networth_auth_token';

export const tokenStorage = {
  get: async () => Platform.OS === 'web'
    ? globalThis.localStorage?.getItem(TOKEN_KEY) ?? null
    : SecureStore.getItemAsync(TOKEN_KEY),
  set: async (token: string) => {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(TOKEN_KEY, token);
    else await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  remove: async () => {
    if (Platform.OS === 'web') globalThis.localStorage?.removeItem(TOKEN_KEY);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
