import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import LibraryScreen from './src/components/LibraryScreen';

const capa = (texto) => `https://placehold.co/320x240/202433/8b5cf6/png?text=${texto}`;

// Dados fixos de exemplo. No projeto principal, virão da API (GET /library).
const games = [
  { id: 1, title: 'Super Mario World', console: 'SNES', image: capa('Mario+World'), accessLevel: 1 },
  { id: 2, title: 'Sonic the Hedgehog', console: 'MD', image: capa('Sonic'), accessLevel: 1 },
  { id: 3, title: 'Pokemon Emerald', console: 'GBA', image: capa('Emerald'), accessLevel: 2 },
  { id: 4, title: 'Crash Bandicoot', console: 'PS1', image: capa('Crash'), accessLevel: 2 },
  { id: 5, title: 'Zelda Ocarina of Time', console: 'N64', image: 'link-quebrado', accessLevel: 3 },
  { id: 6, title: 'Tetris', console: 'GB', image: capa('Tetris'), accessLevel: 1 },
  { id: 7, title: 'Contra', console: 'NES', image: capa('Contra'), accessLevel: 1 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <LibraryScreen
        games={games}
        initialFavoriteIds={[1]}
        onGamePress={(game) =>
          Alert.alert(game.title, 'Na versão web, este toque navega para /rooms/' + game.id)
        }
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11131a',
    paddingTop: 44,
  },
});
