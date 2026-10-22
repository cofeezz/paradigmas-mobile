import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';

export default function FilterBar({
  filters,
  activeFilter,
  onChangeFilter,
  showOnlyFavorites,
  onToggleFavorites,
  resultCount,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>▼ FILTRAR_POR_PLATAFORMA:</Text>
        <Text style={styles.count}>{resultCount} JOGOS_ENCONTRADOS</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Pressable
          onPress={onToggleFavorites}
          style={[styles.chip, showOnlyFavorites && styles.chipActive]}
        >
          <Text style={[styles.chipText, showOnlyFavorites && styles.chipTextActive]}>★ FAVORITOS</Text>
        </Pressable>
        {filters.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => onChangeFilter(f.value)}
            style={[styles.chip, activeFilter === f.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === f.value && styles.chipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'rgba(24, 27, 36, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#34384a',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  label: { fontSize: 10, letterSpacing: 2, color: '#727896' },
  count: { fontSize: 10, letterSpacing: 1, color: '#727896' },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#34384a',
    borderRadius: 4,
  },
  chipActive: {
    borderColor: '#fcfcfc',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  chipText: { fontSize: 10, letterSpacing: 1, color: '#9aa3c7' },
  chipTextActive: { color: '#fcfcfc' },
});
