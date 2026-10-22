import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChangeText, onClear }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="BUSCAR_JOGO..."
        placeholderTextColor="#727896"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={12}>
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: 'rgba(17, 19, 26, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#34384a',
  },
  icon: { fontSize: 16, color: '#727896' },
  input: {
    flex: 1,
    fontSize: 12,
    letterSpacing: 2,
    color: '#f2f4ff',
  },
  clear: { fontSize: 14, color: '#727896' },
});
