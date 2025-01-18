import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import styles from './CSS/UserHomeCss';
import {
  categories,
  topPicks,
  recentlyListenedAlbums,
  recentlyListenedSongs,
  favoriteArtists,
  personalizedPlaylists,
  newReleases,
  mixedSongs,
} from './data/userHomedata';

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    console.log('Selected category:', category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Your Music Type</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategorySelect(category)}
              style={[
                styles.categoryPill,
                category === selectedCategory ? styles.activePill : null,
              ]}>
              <Text
                style={[
                  styles.categoryText,
                  category === selectedCategory ? styles.activeText : null,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>our top picks for you</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {topPicks.map((pick, index) => (
            <TouchableOpacity key={index} style={styles.albumCard}>
              <Image
                source={{uri: pick.imageUrl}}
                style={styles.albumImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.albumArt} />
              <Text style={styles.albumTitle}>{pick.title}</Text>
              <Text style={styles.albumArtist}>{pick.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently listened albums</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {recentlyListenedAlbums.map((album, index) => (
            <TouchableOpacity key={index} style={styles.albumCard}>
              <Image
                source={{uri: album.imageUrl}}
                style={styles.albumImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.albumArt} />
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumArtist}>{album.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently listened songs</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {recentlyListenedSongs.map((song, index) => (
            <TouchableOpacity key={index} style={styles.songCard}>
              <Image
                source={{uri: song.imageUrl}}
                style={styles.wishing}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.albumArt} />
              <Text style={styles.songTitleSong}>{song.title}</Text>
              <Text style={styles.artistNameSong}>{song.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>your favorite artists</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {favoriteArtists.map((artist, index) => (
            <TouchableOpacity key={index} style={styles.artistSecCard}>
              <Image
                source={{uri: artist.imageUrl}}
                style={styles.artistImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.albumArt} />
              <Text style={styles.favArtistName}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            playlists made upon your music taste
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {personalizedPlaylists.map((playlist, index) => (
            <TouchableOpacity key={index} style={styles.albumCard}>
              <Image
                source={{uri: playlist.imageUrl}}
                style={styles.albumImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.playlistArt} />
              <Text style={styles.albumTitle}>{playlist.title}</Text>
              <Text style={styles.albumArtist}>{playlist.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            New Music Released by your artists
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {newReleases.map((release, index) => (
            <TouchableOpacity key={index} style={styles.albumCard}>
              <Image
                source={{uri: release.imageUrl}}
                style={styles.albumImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.playlistArt} />
              <Text style={styles.albumTitle}>{release.title}</Text>
              <Text style={styles.albumArtist}>{release.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mix songs of your artists</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.popularSongsContainer}>
          {mixedSongs.map((song, index) => (
            <TouchableOpacity key={index} style={styles.albumCard}>
              <Image
                source={{uri: song.imageUrl}}
                style={styles.albumImg}
                defaultSource={require('../../assests/logo/logo.png')} // Placeholder image
                onError={() => console.error('Image failed to load')}
              />
              <View style={styles.playlistArt} />
              <Text style={styles.albumTitle}>{song.title}</Text>
              <Text style={styles.albumArtist}>{song.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserHome;
