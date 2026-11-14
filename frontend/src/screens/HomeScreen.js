import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  archiveTodo,
  restoreTodo,
} from '../api/todoApi';

const THEMES = {
  sunrise: {
    id: 'sunrise',
    name: 'Sunrise',
    bg: '#fdf2f8',
    card: '#ffffff',
    primary: '#ec4899',
    secondary: '#f472b6',
    text: '#1e293b',
    subText: '#9d174d',
    cardBorder: '#fce7f3',
    pillBg: '#fbcfe8',
    pillText: '#831843',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    bg: '#f0f9ff',
    card: '#ffffff',
    primary: '#0284c7',
    secondary: '#38bdf8',
    text: '#0f172a',
    subText: '#0369a1',
    cardBorder: '#e0f2fe',
    pillBg: '#bae6fd',
    pillText: '#0c4a6e',
  },
  midnight: {
    id: 'midnight',
    name: 'Dark',
    bg: '#0f172a',
    card: '#1e293b',
    primary: '#818cf8',
    secondary: '#a5b4fc',
    text: '#f8fafc',
    subText: '#94a3b8',
    cardBorder: '#334155',
    pillBg: '#334155',
    pillText: '#e2e8f0',
  },
};

const HomeScreen = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState('sunrise');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archive'

  const theme = THEMES[activeTheme];

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch todos from server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title) => {
    try {
      const res = await createTodo(title);
      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      Alert.alert('Error', 'Could not add to-do');
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      const res = await updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      Alert.alert('Error', 'Could not update status');
    }
  };

  const handleArchiveTodo = async (id) => {
    try {
      const res = await archiveTodo(id);
      setTodos((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      Alert.alert('Error', 'Could not archive item');
    }
  };

  const handleRestoreTodo = async (id) => {
    try {
      const res = await restoreTodo(id);
      setTodos((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      Alert.alert('Error', 'Could not restore item');
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      Alert.alert('Error', 'Could not permanently delete item');
    }
  };

  // Segregate active vs archived
  const activeTodos = todos.filter((t) => !t.isArchived);
  const archivedTodos = todos.filter((t) => t.isArchived);
  const completedCount = activeTodos.filter((t) => t.completed).length;

  const getMotivationalQuote = () => {
    if (activeTodos.length === 0) return '“A journey of a thousand miles begins with a single step.”';
    if (completedCount === activeTodos.length) return '“Victory! You cleared everything on your list today.” ';
    if (completedCount > 0) return '“Keep the momentum going — consistency is power.” ';
    return '“Focus on what matters most. Take it one task at a time.” ';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={styles.centerWrapper}>
        <View style={[styles.appCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          
          {/* Theme Selector Strip */}
          <View style={styles.themeSelectorRow}>
            <Text style={[styles.themeLabel, { color: theme.subText }]}>Theme:</Text>
            {Object.keys(THEMES).map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveTheme(key)}
                style={[
                  styles.themeTab,
                  activeTheme === key && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeTabText,
                    { color: activeTheme === key ? '#ffffff' : theme.subText },
                  ]}
                >
                  {THEMES[key].name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>To-Do List</Text>
              <Text style={[styles.motivationalSub, { color: theme.subText }]}>
                {getMotivationalQuote()}
              </Text>
            </View>

            <View style={styles.statusBox}>
              <View style={[styles.progressPill, { backgroundColor: theme.pillBg }]}>
                <Text style={[styles.progressText, { color: theme.pillText }]}>
                  {completedCount} / {activeTodos.length} Done
                </Text>
              </View>
            </View>
          </View>

          {/* View Mode Tabs (Active vs Archive) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('active')}
              style={[
                styles.tabBtn,
                activeTab === 'active' && { borderBottomColor: theme.primary, borderBottomWidth: 3 },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'active' ? theme.primary : '#94a3b8' },
                ]}
              >
                Active ({activeTodos.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('archive')}
              style={[
                styles.tabBtn,
                activeTab === 'archive' && { borderBottomColor: theme.primary, borderBottomWidth: 3 },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'archive' ? theme.primary : '#94a3b8' },
                ]}
              >
                Archived ({archivedTodos.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form only displays on Active view */}
          {activeTab === 'active' && (
            <TodoForm onAddTodo={handleAddTodo} customColor={theme.primary} />
          )}

          {/* List Display */}
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
          ) : (
            <FlatList
              data={activeTab === 'active' ? activeTodos : archivedTodos}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TodoItem
                  todo={item}
                  onToggle={handleToggleTodo}
                  onArchive={handleArchiveTodo}
                  onRestore={handleRestoreTodo}
                  onPermanentDelete={handlePermanentDelete}
                  isArchivedView={activeTab === 'archive'}
                  activeColor={theme.primary}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>
                    {activeTab === 'active' ? '' : ''}
                  </Text>
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    {activeTab === 'active' ? 'No active tasks!' : 'Archive is empty'}
                  </Text>
                  <Text style={[styles.emptyText, { color: theme.subText }]}>
                    {activeTab === 'active'
                      ? 'Add your first task above.'
                      : 'Tasks you remove will appear here for recovery.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'web' ? 36 : 16,
  },
  appCard: {
    width: '100%',
    maxWidth: 520,
    flex: 1,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  themeTab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  themeTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  motivationalSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  statusBox: {
    alignItems: 'flex-end',
  },
  progressPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
    gap: 20,
  },
  tabBtn: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;