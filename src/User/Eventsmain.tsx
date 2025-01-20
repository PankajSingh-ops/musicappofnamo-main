import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';

type RootStackParamList = {
  EventDetails: {
    eventId: number;
  };
};

type EventTicketNavigationProp = NavigationProp<RootStackParamList>;

interface Event {
  id: number;
  event_title: string;
  event_cover: string;
  event_location: string;
  start_date: string;
  start_time: string;
  sell_tickets: boolean;
  total_tickets: number;
  ticket_price: number;
  creator_name: string;
}

const Eventsmain = () => {
  const navigation = useNavigation<EventTicketNavigationProp>();
  const [likedEvents, setLikedEvents] = useState<{[key: string]: boolean}>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (event: Event) => {
    try {
      await Share.share({
        message: `Check out ${event.event_title} at ${
          event.event_location
        } on ${new Date(event.start_date).toLocaleDateString()}!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  if (loading) {
    return (
      <View style={[styles.page, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E52F2E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.page, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      {events.map(event => (
        <View key={event.id} style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {event.event_title}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => toggleLike(event.id.toString())}
                style={styles.iconButton}>
                <Icon
                  name={
                    likedEvents[event.id.toString()] ? 'heart' : 'heart-outline'
                  }
                  size={24}
                  color={
                    likedEvents[event.id.toString()] ? '#ff4081' : '#ffffff'
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShare(event)}
                style={styles.iconButton}>
                <Icon name="share-variant" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.artistSection}>
            <View style={styles.artistIconContainer}>
              <Icon name="music" size={32} color="#ffffff" />
            </View>
            <View style={styles.artistInfo}>
              <Text style={styles.artistLabel}>Featured Artist</Text>
              <Text style={styles.artistName}>{event.creator_name}</Text>
            </View>
          </View>
          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color="#E52F2E" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>
                  {new Date(event.start_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.infoLabel}>Start Date</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={20} color="#E52F2E" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{event.start_time}</Text>
                <Text style={styles.infoLabel}>Time</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="map-marker" size={20} color="#E52F2E" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>{event.event_location}</Text>
                <Text style={styles.infoLabel}>Location</Text>
              </View>
            </View>

            {event.sell_tickets && (
              <View style={styles.infoItem}>
                <Icon name="ticket" size={20} color="#E52F2E" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoValue}>
                    {event.total_tickets} available
                  </Text>
                  <Text style={styles.infoLabel}>Tickets Available</Text>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>Price per ticket</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceWhole}>
                  ₹
                  {event.sell_tickets ? Math.floor(event.ticket_price) : 'Free'}
                </Text>
                {event.sell_tickets && event.ticket_price % 1 !== 0 && (
                  <Text style={styles.priceDecimal}>
                    .{(event.ticket_price % 1).toFixed(2).slice(2)}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.getTicketsButton}
              onPress={() => {
                navigation.navigate('EventsDetails', {eventId: event.id});
              }}>
              <Text style={styles.getTicketsText}>
                {event.sell_tickets ? 'Get Tickets' : 'View Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000',
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111827',
    width: '90%',
    margin: 'auto',
    marginTop: 20,
    borderColor: '#E52F2E',
    borderWidth: 2,
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E52F2E',
    fontSize: 16,
    textAlign: 'center',
  },
  eventCover: {
    width: '100%',
    height: 200,
  },
  background: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E52F2E',
    gap: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 20,
  },
  title: {
    width: '70%',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  artistIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#E52F2E',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistInfo: {
    marginLeft: 12,
    flex: 1,
  },
  artistLabel: {
    color: '#E52F2E',
    fontSize: 14,
  },
  artistName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoLabel: {
    color: '#E52F2E',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
  },
  priceLabel: {
    color: '#E52F2E',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceWhole: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceDecimal: {
    color: '#E52F2E',
    fontSize: 17,
    marginLeft: 2,
  },
  getTicketsButton: {
    backgroundColor: '#E52F2E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  getTicketsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Eventsmain;
