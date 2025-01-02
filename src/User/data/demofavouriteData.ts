import { Track } from '../../../type';

export const favoritesData: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    artwork:
      'https://d1csarkz8obe9u.cloudfront.net/themedlandingpages/tlp_hero_album-cover-art-73ab5b3d9b81f442cb2288630ab63acf.jpg?ts%20=%201698245952',
    duration: '3:20',
    url: 'https://pub-2abc3b4ca9c946a8be84d73df55326ac.r2.dev/music/5810d2cb80f2aaacfaa874583bad24b4.mp3',
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    artwork:
      'https://marketplace.canva.com/EAFWz37wwl0/1/0/1600w/canva-black-minimalist-photocentric-rose-on-fire-hip-hop-album-cover-laJL2q01ZUU.jpg',
    duration: '3:54',
    url: require('../../../audio/gaana.mp3'),
  },
  {
    id: '3',
    title: 'Memories',
    artist: 'Maroon 5',
    artwork: 'https://via.placeholder.com/150',
    duration: '3:12',
    url: require('../../../audio/hindi.mp3'),
  },
  {
    id: '4',
    title: 'Lamhe',
    artist: 'Atif Aslam',
    artwork: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQsLLA4C1IYz3OSjdJlm8qINPDRtmioEuhhg&s',
    duration: '3:12',
    url: require('../../../audio/lamhe.mp3'),
  },
  {
    id: '5',
    title: 'wah Ladki',
    artist: 'Pankaj',
    artwork: 'https://media.istockphoto.com/id/636379014/photo/hands-forming-a-heart-shape-with-sunset-silhouette.jpg?s=612x612&w=0&k=20&c=CgjWWGEasjgwia2VT7ufXa10azba2HXmUDe96wZG8F0=',
    duration: '3:12',
    url: require('../../../audio/voh.mp3'),
  },
];
