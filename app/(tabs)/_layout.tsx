import migrateDbIfNeeded from "@/helpers/migrateDbIfNeeded";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function LayoutTabs() {
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
  <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  >
    <View style={styles.innerContainer}>
      <SQLiteProvider databaseName="controle-contas.db" onInit={migrateDbIfNeeded}>
        <PaperProvider theme={theme}>
          <Tabs
            initialRouteName="home"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.disabled,
              tabBarStyle: {
                paddingBottom: 40,
              }
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: 'Meses',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="calendar" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="categorias"
              options={{
                title: 'Categorias',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="tag" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </PaperProvider>
      </SQLiteProvider>
    </View>
  </KeyboardAvoidingView>
 )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});