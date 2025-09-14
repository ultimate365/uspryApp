import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Fuse from 'fuse.js';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import CustomTextInput from './CustomTextInput';

/** Debounce hook */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Highlight matched text */
function HighlightMatch({ text, matches }) {
  if (!text || !matches || matches.length === 0) {
    return <Text>{text}</Text>;
  }

  const raw = matches.flatMap(m => m.indices || []);
  if (raw.length === 0) return <Text>{text}</Text>;

  const sorted = raw.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length || s > merged[merged.length - 1][1] + 1) {
      merged.push([s, e]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    }
  }

  const parts = [];
  let last = 0;
  merged.forEach(([s, e], i) => {
    if (last < s) {
      parts.push(<Text key={`n-${i}`}>{text.slice(last, s)}</Text>);
    }
    parts.push(
      <Text key={`h-${i}`} style={styles.highlight}>
        {text.slice(s, e + 1)}
      </Text>,
    );
    last = e + 1;
  });
  if (last < text.length) {
    parts.push(<Text key="end">{text.slice(last)}</Text>);
  }

  return <Text>{parts}</Text>;
}

/**
 * Reusable FuzzySearch Component for React Native
 */
export default function FuzzySearch({
  data,
  keys,
  title,
  placeholder = 'Search...',
  renderItem,
  threshold = 0.5,
  limit,
  inputProps = {},
  onItemClick = () => {},
}) {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold,
        includeMatches: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data, keys, threshold],
  );

  const results = useMemo(() => {
    if (!debounced) return data.map(item => ({ item }));
    const found = fuse.search(debounced);
    return typeof limit === 'number' ? found.slice(0, limit) : found;
  }, [debounced, fuse, data, limit]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <CustomTextInput
          placeholder={placeholder}
          title={title}
          value={query}
          onChangeText={setQuery}
          {...inputProps}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {query.length > 0 && results.length > 0 && (
        <ScrollView
          nestedScrollEnabled={true}
          style={{
            marginVertical: responsiveScreenHeight(2),
            maxHeight: responsiveScreenHeight(20),
          }}
        >
          <FlatList
            data={results}
            scrollEnabled={false} // ✅ disables nested scrolling
            keyExtractor={(_, idx) => idx.toString()}
            style={styles.resultsList}
            renderItem={({ item: res }) => {
              const matchesForKey = key =>
                res.matches?.filter(m => m.key === key) || [];

              return (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => onItemClick(res.item)}
                >
                  {renderItem({
                    item: res.item,
                    matchesForKey,
                    HighlightMatch,
                  })}
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0ad4e',
    borderRadius: 6,
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsList: {
    marginTop: 8,
    // maxHeight: 250,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  resultItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  highlight: {
    backgroundColor: 'yellow',
  },
});
