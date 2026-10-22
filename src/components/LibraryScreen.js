import { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import GameCard from './GameCard';

const filters = [
  { label: 'TODOS', value: 'all' },
  { label: 'NES', value: 'nes' },
  { label: 'SNES', value: 'snes' },
  { label: 'GBA', value: 'gba' },
  { label: 'PS1', value: 'ps1' },
  { label: 'N64', value: 'n64' },
  { label: 'MEGA DRIVE', value: 'mega drive' },
  { label: 'GAME BOY', value: 'game boy' },
];

const filterMap = {
  'mega drive': ['md', 'mega drive', 'genesis'],
  'game boy': ['gb', 'game boy', 'gbc', 'gameboy'],
};

export default function LibraryScreen({
  games,
  loading = false,
  error = '',
  onRetry,
  onGamePress,
  onToggleFavorite,
  initialFavoriteIds = [],
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set(initialFavoriteIds));

  const query = searchQuery.toLowerCase().trim();

  const filteredGames = games.filter((game) => {
    const consoleLC = game.console.toLowerCase();

    const matchesFilter =
      activeFilter === 'all' ||
      consoleLC === activeFilter ||
      (filterMap[activeFilter]?.includes(consoleLC) ?? false);

    const matchesSearch =
      !query || game.title.toLowerCase().includes(query) || consoleLC.includes(query);

    const matchesFavorites = !showOnlyFavorites || favoriteIds.has(game.id);

    return matchesFilter && matchesSearch && matchesFavorites;
  });

  function toggleFavorite(game) {
    setFavoriteIds((anterior) => {
      const proximo = new Set(anterior);
      if (proximo.has(game.id)) proximo.delete(game.id);
      else proximo.add(game.id);
      return proximo;
    });
    onToggleFavorite?.(game);
  }

  function renderBody() {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color="#6d4ed8" />
          <Text style={styles.stateText}>CARREGANDO ACERVO...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.state}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <Pressable onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>TENTAR_NOVAMENTE</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredGames}
        keyExtractor={(game) => String(game.id)}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <GameCard
              game={item}
              favorito={favoriteIds.has(item.id)}
              onPress={onGamePress}
              onToggleFavorite={toggleFavorite}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.state}>
            <Text style={styles.stateText}>
              {query ? `Nenhum jogo encontrado para "${searchQuery}"` : 'Nenhum jogo encontrado'}
            </Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>▣ ARCHV.ROOMS</Text>
      </View>
      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        resultCount={filteredGames.length}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11131a' },
  topbar: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(24, 27, 36, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: '#34384a',
  },
  brand: { fontSize: 14, letterSpacing: 3, color: '#9aa3c7' },
  body: { flex: 1 },
  grid: { padding: 9 },
  cell: { flex: 1, maxWidth: '50%', padding: 5 },
  state: { alignItems: 'center', gap: 12, paddingVertical: 80 },
  stateText: { fontSize: 10, letterSpacing: 2, color: '#727896', textAlign: 'center' },
  errorText: { fontSize: 11, letterSpacing: 2, color: '#fb7185', textAlign: 'center' },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fcfcfc',
    borderRadius: 4,
  },
  retryText: { fontSize: 9, letterSpacing: 2, color: '#fcfcfc' },
});
