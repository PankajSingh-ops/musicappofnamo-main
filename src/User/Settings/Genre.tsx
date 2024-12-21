import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { genres } from './GenreData';
import GenreCard from './GenreCard';
import Header from '../../common/HeaderUser';

const Genre = () => {
  return (
    <SafeAreaView style={styles.container}>
        <Header/>
      <FlatList
        data={genres}
        renderItem={({ item }) => <GenreCard genre={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  listContent: {
    padding: 8,
  },
});

export default Genre;
