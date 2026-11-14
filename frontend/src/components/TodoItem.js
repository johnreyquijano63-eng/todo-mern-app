import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const TodoItem = ({
  todo,
  onToggle,
  onArchive,
  onRestore,
  onPermanentDelete,
  isArchivedView = false,
  activeColor = '#ec4899',
}) => {
  return (
    <View style={[styles.card, todo.completed && styles.cardCompleted]}>
      {!isArchivedView ? (
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => onToggle(todo._id, !todo.completed)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              todo.completed && { backgroundColor: activeColor, borderColor: activeColor },
            ]}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text
            style={[styles.title, todo.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.archivedTitle]} numberOfLines={2}>
            {todo.title}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        {isArchivedView ? (
          <>
            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={() => onRestore(todo._id)}
              activeOpacity={0.7}
            >
              <Text style={styles.restoreText}>↺ Restore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onPermanentDelete(todo._id)}
              activeOpacity={0.6}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onArchive(todo._id)}
            activeOpacity={0.6}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
    opacity: 0.7,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 15,
    color: '#0f172a',
    flex: 1,
    fontWeight: '500',
    fontFamily: Platform.OS === 'web' ? 'system-ui' : undefined,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
    fontWeight: '400',
  },
  archivedTitle: {
    color: '#64748b',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restoreBtn: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
  },
  restoreText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default TodoItem;