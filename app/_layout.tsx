import migrateDbIfNeeded from "@/helpers/migrateDbIfNeeded";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
 const theme = {
  ...DefaultTheme,
  dark: false,        // para manter sempre claro
  colors: {
   ...DefaultTheme.colors,
   primary: '#1E90FF',            // azul dodger
   accent: '#1C86EE',             // azul complementar
   background: '#FFFFFF',         // fundo branco
   surface: '#FFFFFF',
   text: '#000000',
   placeholder: '#666666',
   disabled: '#CCCCCC',
   backdrop: 'rgba(0,0,0,0.5)',
  },
 };

 return (
  <SQLiteProvider databaseName="controle-contas.db" onInit={migrateDbIfNeeded}>   
   <PaperProvider theme={theme}>
    <Stack screenOptions={{ headerShown: false }} />
   </PaperProvider>
  </SQLiteProvider>
 )
 
}
