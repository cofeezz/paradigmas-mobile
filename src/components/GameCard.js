import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const imagemReserva = 'https://placehold.co/320x240/202433/727896/png?text=Sem+capa';

export default function GameCard({ game, favorito, onPress, onToggleFavorite }) {
  const [imagemComErro, setImagemComErro] = useState(false);

  return (
    <Pressable
      onPress={() => onPress?.(game)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.thumb}>
        <Image
          source={{ uri: imagemComErro ? imagemReserva : game.image }}
          onError={() => setImagemComErro(true)}
          style={styles.image}
        />
        <Text style={styles.badge}>{game.console}</Text>
        <Pressable
          onPress={() => onToggleFavorite?.(game)}
          hitSlop={8}
          style={[styles.favoriteBtn, favorito && styles.favoriteBtnActive]}
        >
          <Text style={[styles.star, favorito && styles.starActive]}>★</Text>
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
        <Text style={styles.meta}>{game.console}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#202433',
    borderWidth: 1,
    borderColor: 'rgba(109, 78, 216, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardPressed: { borderColor: '#fcfcfc', opacity: 0.85 },
  thumb: { aspectRatio: 4 / 3, backgroundColor: '#11131a' },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    color: '#fff',
    borderRadius: 2,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 19, 26, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(109, 78, 216, 0.3)',
  },
  favoriteBtnActive: {
    borderColor: '#facc15',
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    shadowColor: '#facc15',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  star: { fontSize: 14, color: '#727896' },
  starActive: { color: '#facc15' },
  info: { padding: 10 },
  title: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#f2f4ff',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  meta: { fontSize: 9, letterSpacing: 1, color: '#727896' },
});
