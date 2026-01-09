/// <reference types="cypress" />

import AsyncStorage from "@react-native-async-storage/async-storage";

declare global {
  interface Window {
    AsyncStorage: typeof AsyncStorage;
  }
}

export {};
