import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {format} from 'date-fns';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EventsDetailsCss';

interface EventData {
  id: number;
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
  creator_name: string;
}

interface EventDetailsPageProps {
  route: {
    params: {
      eventId: number;
    };
  };
  navigation: any;
}

const EventsDetails: React.FC<EventDetailsPageProps> = ({route}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(route.params.eventId, 'eventid');

    fetchEventDetails();
  }, [route.params.eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/events/${route.params.eventId}`,
      );
      if (!response.ok) {
        throw new Error('Event not found');
      }
      const data = await response.json();
      setEventData(data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch event details',
      );
      setLoading(false);
    }
  };

  const hasValidVideo =
    eventData?.event_video &&
    eventData.event_video.trim() !== '' &&
    eventData.event_video !== 'https://example.com/video.mp4';

  const formatDateTime = (dateString: string, timeString: string): string => {
    try {
      // Parse the date string
      const date = new Date(dateString);

      // Extract hours and minutes from the time string
      const [hours, minutes] = timeString.split(':').map(Number);

      // Set the hours and minutes on the date object
      date.setHours(hours);
      date.setMinutes(minutes);

      // Format the final date
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Date not available';
    }
  };

  const onVideoLoad = () => {
    setShowVideo(true);
  };

  const onVideoError = () => {
    setShowVideo(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E62F2E" />
      </View>
    );
  }

  if (error || !eventData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load event'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchEventDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Header Section with Image */}
        <View style={styles.header}>
          <Image
            source={{uri: eventData.event_cover}}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{eventData.event_title}</Text>
            <View style={styles.artistContainer}>
              <Icon name="account-music" size={24} color="#fff" />
              <Text style={styles.artistName}>{eventData.creator_name}</Text>
            </View>
          </View>
        </View>

        {/* Video Preview - Only shown if valid video exists */}
        {hasValidVideo && (
          <View
            style={[styles.videoContainer, !showVideo && styles.hiddenVideo]}>
            <Video
              source={{uri: eventData.event_video}}
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
              onPress={() => setIsPaused(!isPaused)}>
              <Icon name={isPaused ? 'play' : 'pause'} size={40} color="#fff" />
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
                {formatDateTime(eventData.start_date, eventData.start_time)}
              </Text>
              <Text style={styles.dateTime}>
                <Icon name="calendar-end" size={16} color="#999" /> End:{' '}
                {formatDateTime(eventData.end_date, eventData.end_time)}
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

export default EventsDetails;
