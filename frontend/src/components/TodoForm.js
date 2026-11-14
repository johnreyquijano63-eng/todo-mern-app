import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const TodoForm = ({ onAddTodo, customColor = '#ec4899' }) => {
  const [text, setText] = useState('');

  const handlePress = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="add a new task"
        placeholderTextColor="#94a3b8"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handlePress}
        returnKeyType="done"
      />
      <TouchableOpacity
  style={[
    styles.button,
    { backgroundColor: text.trim() ? customColor : '#cbd5e1' },
  ]}
  onPress={handlePress}
  disabled={!text.trim()}
>
  <Text style={[styles.buttonText, !text.trim() && { color: '#64748b' }]}>
    + Add
  </Text>
</TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#0f172a',
    paddingHorizontal: 14,
    fontFamily: Platform.OS === 'web' ? 'system-ui' : undefined,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 12,
  },
buttonDisabled: {
  backgroundColor: '#e2e8f0', // cleaner neutral
  opacity: 0.7,
},
buttonText: {
  color: '#ffffff',
  fontWeight: '700',
  fontSize: 14,
},
});

export default TodoForm;