import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import LibraryScreen from './src/components/LibraryScreen';

const capa = (texto) => `https://placehold.co/320x240/202433/8b5cf6/png?text=${texto}`;

// Dados fixos de exemplo. No projeto principal, virão da API (GET /library).
const games = [
  { id: 1, title: 'Super Mario World', console: 'SNES', image: 'https://upload.wikimedia.org/wikipedia/pt/0/06/Super-Mario-World.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original', accessLevel: 1 },
  { id: 2, title: 'Sonic the Hedgehog', console: 'MD', image: 'https://m.media-amazon.com/images/I/81TexPzUfyL._AC_UF1000,1000_QL80_.jpg', accessLevel: 1 },
  { id: 3, title: 'Pokemon Emerald', console: 'GBA', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1ykERQByGSAHwiwyVFD5bm2Hra9jzm64Pzm3lASh2ng&s=10', accessLevel: 2 },
  { id: 4, title: 'Crash Bandicoot', console: 'PS1', image: 'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original', accessLevel: 2 },
  { id: 5, title: 'Zelda Ocarina of Time', console: 'N64', image: 'https://upload.wikimedia.org/wikipedia/pt/1/17/The_Legend_of_Zelda_Ocarina_of_Time_capa.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original', accessLevel: 3 },
  { id: 6, title: 'Tetris', console: 'GB', image: 'https://bdjogos.com.br/capas/4166-Tetris-Game-Boy-capa-1.jpg', accessLevel: 1 },
  { id: 7, title: 'Contra', console: 'NES', image: 'https://s2-techtudo.glbimg.com/JnhGJy_dkIRgr85Cq0G4HNSz7sc=/0x0:695x522/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/m/P/AnCd0iQJmA7Ty63BboAQ/2015-11-04-capa.jpg', accessLevel: 1 },
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
