import {Genre} from '../../../type';

export const genres: Genre[] = [
  {
    id: '1',
    name: 'Devotional',
    image: require('../../../assests/categories/images/devotional.jpg'), // You'll need to add these images
    totalSongs: 150,
  },
  {
    id: '2',
    name: 'Single',
    image: require('../../../assests/categories/images/single.jpg'), // You'll need to add these images
    totalSongs: 200,
  },
  {
    id: '3',
    name: 'Carnatic',
    image: require('../../../assests/categories/images/carnatic.jpg'), // You'll need to add these images
    totalSongs: 100,
  },
  {
    id: '4',
    name: 'Folk',
    image: require('../../../assests/categories/images/folj.jpg'), // You'll need to add these images
    totalSongs: 120,
  },
  {
    id: '5',
    name: 'Pop',
    image: require('../../../assests/categories/images/pop.jpg'), // You'll need to add these images
    totalSongs: 180,
  },
  {
    id: '6',
    name: 'Rock',
    image: require('../../../assests/categories/images/rock.jpg'), // You'll need to add these images
    totalSongs: 160,
  },
  {
    id: '7',
    name: 'Modern Classic',
    image: require('../../../assests/categories/images/modern.jpg'), // You'll need to add these images
    totalSongs: 90,
  },
  {
    id: '8',
    name: 'Hip Hop',
    image: require('../../../assests/categories/images/hiphop.jpg'), // You'll need to add these images
    totalSongs: 140,
  },
  {
    id: '9',
    name: 'Other',
    image: require('../../../assests/categories/images/other.jpg'), // You'll need to add these images
    totalSongs: 50,
  },
];
