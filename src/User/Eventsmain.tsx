import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {format} from 'date-fns';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EventData {
  event_title: string;
  event_cover: string;
  event_video: string;
  event_location: string;
  location_url: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  timezone: string;
  sell_tickets: boolean;
  total_tickets: number;
  ticket_price: number;
  event_description: string;
  full_name: string;
}

interface EventDetailsPageProps {
  route: {
    params?: {
      eventData: EventData;
    };
  };
}


const Eventsmain: React.FC<EventDetailsPageProps> = ({route}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  const eventData = route.params?.eventData || {
    event_title: 'Tech Conference 2024',
    event_cover:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070',
    event_video:
      'https://pub-2abc3b4ca9c946a8be84d73df55326ac.r2.dev/event-videos/34fd785fbc5de985ab74e7a49216e6b9.mp4',
    event_location: 'Silicon Valley Convention Center',
    location_url: 'https://maps.google.com',
    start_date: '2024-04-15',
    start_time: '09:00',
    end_date: '2024-04-17',
    end_time: '18:00',
    timezone: 'PST',
    sell_tickets: true,
    total_tickets: 500,
    ticket_price: 299.99,
    event_description:
      'Join us for the biggest tech conference of the year. Three days of inspiring talks, workshops, and networking opportunities with industry leaders.',
    full_name: 'TechCon International',
  };

 
  const hasValidVideo = eventData.event_video && eventData.event_video.trim() !== '' && eventData.event_video !== 'https://example.com/video.mp4';

  const formatDate = (date: string, time: string): string => {
    const dateObj = new Date(`${date}T${time}`);
    return format(dateObj, 'MMM d, yyyy • h:mm a');
  };

  const onVideoLoad = () => {
    setShowVideo(true);
  };

  const onVideoError = () => {
    setShowVideo(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Header Section with Image */}
        <View style={styles.header}>
          <Image
            source={{ uri: eventData.event_cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{eventData.event_title}</Text>
            <View style={styles.artistContainer}>
              <Icon name="account-music" size={24} color="#fff" />
              <Text style={styles.artistName}>{eventData.full_name}</Text>
            </View>
          </View>
        </View>

        {/* Video Preview - Only shown if valid video exists */}
        {hasValidVideo && (
          <View style={[styles.videoContainer, !showVideo && styles.hiddenVideo]}>
            <Video
              source={{ uri: eventData.event_video }}
              style={styles.video}
              paused={isPaused}
              repeat={true}
              resizeMode="cover"
              onLoad={onVideoLoad}
              onError={onVideoError}
              playInBackground={false}
              playWhenInactive={false}
            />
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPaused(!isPaused)}
            >
              <Icon 
                name={isPaused ? "play" : "pause"} 
                size={40} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        )}
        {/* Details Section */}
        <View style={styles.detailsContainer}>
          {/* Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.sectionHeaderRow}>
              <Icon name="calendar-clock" size={24} color="#fff" />
              <Text style={styles.sectionTitle}>Date & Time</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.dateTime}>
                <Icon name="calendar-start" size={16} color="#999" /> Start:{' '}
                {formatDate(eventData.start_date, eventData.start_time)}
              </Text>
              <Text style={styles.dateTime}>
                <Icon name="calendar-end" size={16} color="#999" /> End:{' '}
                {formatDate(eventData.end_date, eventData.end_time)}
              </Text>
              <Text style={styles.timezone}>
                <Icon name="earth" size={16} color="#999" />{' '}
                {eventData.timezone}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.infoSection}>
            <View style={styles.sectionHeaderRow}>
              <Icon name="map-marker" size={24} color="#fff" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <TouchableOpacity style={styles.locationContainer}>
              <Text style={styles.location}>{eventData.event_location}</Text>
              <Icon name="map-marker-radius" size={24} color="#E62F2E" />
            </TouchableOpacity>
          </View>

          {/* Ticket Information */}
          {eventData.sell_tickets && (
            <View style={styles.infoSection}>
              <View style={styles.sectionHeaderRow}>
                <Icon name="ticket" size={24} color="#fff" />
                <Text style={styles.sectionTitle}>Ticket Information</Text>
              </View>
              <View style={styles.ticketInfo}>
                <View style={styles.ticketDetail}>
                  <Text style={styles.ticketLabel}>Available Tickets</Text>
                  <Text style={styles.ticketValue}>
                    {eventData.total_tickets}
                  </Text>
                </View>
                <View style={styles.ticketDetail}>
                  <Text style={styles.ticketLabel}>Price per Ticket</Text>
                  <Text style={styles.ticketValue}>
                  &#8377;{eventData.ticket_price}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buyButton}>
                  <Icon name="ticket-confirmation" size={20} color="#fff" />
                  <Text style={styles.buyButtonText}>Buy Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.joinButton}>
                  <Icon name="account-plus" size={20} color="#fff" />
                  <Text style={styles.joinButtonText}>Join Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.infoSection}>
            <View style={styles.sectionHeaderRow}>
              <Icon name="information" size={24} color="#fff" />
              <Text style={styles.sectionTitle}>About the Event</Text>
            </View>
            <Text style={styles.description}>
              {eventData.event_description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: 200,
    position: 'relative',
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  hiddenVideo: {
    display: 'none',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 300,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },

  detailsContainer: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  dateTimeContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
  dateTime: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  timezone: {
    fontSize: 14,
    color: '#999',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  ticketDetail: {
    flex: 1,
  },
  ticketLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  ticketValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#E62F2E',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
});

export default Eventsmain;
