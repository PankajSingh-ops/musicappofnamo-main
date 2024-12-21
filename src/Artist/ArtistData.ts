import {Artist} from '../../type';

export const sampleArtists: Artist[] = [
  {
    id: '1',
    name: 'Taylor Swift',
    imageUrl: 'https://imageio.forbes.com/specials-images/imageserve/646e6affb9a2a85595a62c39/0x0.jpg?format=jpg&crop=1573,1574,x239,y256,safe&height=416&width=416&fit=bounds',
    coverImageUrl: 'https://people.com/thmb/hGBx2o9so78bb7NZQ_WWPGhBU8c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(1045x501:1047x503)/Taylor-Swift-Reputation-081824-01-9c2cc19b358f42fbb8ae582b8e12c027.jpg',
    monthlyListeners: 85000000,
    genres: ['Pop', 'Country', 'Folk'],
    bio: 'American singer-songwriter known for narrative songs about her personal life...',
    songs: [
      {
        id: '1',
        title: 'Anti-Hero',
        duration: '3:21',
        plays: 1200000,
        albumName: 'Midnights',
        albumCover: 'https://example.com/midnights.jpg',
      },
    ],
  },
];
