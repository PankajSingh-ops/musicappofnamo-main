import React from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import playlistContent from './playList.json';

const PlaylistScreen = () => {
  const renderPlaylistItem = ({item}:any) => (
    <TouchableOpacity style={styles.playlistCard}>
      <Image source={{uri: item.image}} style={styles.playlistImage} />
      <View style={styles.playlistDetails}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <Text style={styles.playlistSubtitle}>
          {item.creator} • {item.trackCount} tracks
        </Text>
        <Text style={styles.playlistDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={playlistContent.playlists}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPlaylistItem}
        ListHeaderComponent={
          <Text style={styles.screenTitle}>My Playlists</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenTitle: {
    fontSize: 24,
    color: 'red',
    margin: 15,
    fontWeight: 'bold',
  },
  playlistCard: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  playlistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  playlistDetails: {
    flex: 1,
  },
  playlistTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlistSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginVertical: 5,
  },
  playlistDescription: {
    color: '#ddd',
    fontSize: 12,
  }
});

export default PlaylistScreen;