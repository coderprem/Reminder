import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV();

export const storage = {
  setItem: async (key: string, value: any) => {
    mmkv.set(key, JSON.stringify(value));
    return Promise.resolve(true);
  },
  getItem: async (key: string) => {
    const stored = mmkv.getString(key);
    if (!stored) return Promise.resolve(null);
  
    try {
      return Promise.resolve(JSON.parse(stored));
    } catch {
      return Promise.resolve(stored);
    }
  },
  removeItem: async (key: string) => {
    mmkv.remove(key);
    return Promise.resolve(true);
  },
  clear: async () => {
    mmkv.clearAll();
    return Promise.resolve(true);
  },
};
