import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Catálogo de filmes" }}
        />
        <Stack.Screen
          name="cadastrar"
          options={{ title: "Cadastrar filme" }}
        />
        <Stack.Screen
          name="explore"
          options={{ title: "Explorar", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
