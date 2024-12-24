import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {Track} from '../../type';

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: Date;
}

interface ExpandedPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleSave: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  isSaved: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
}

const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
  isVisible,
  onClose,
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleSave,
  onToggleShuffle,
  onToggleRepeat,
  isSaved,
  isShuffled,
  repeatMode,
}) => {
  const progress = useProgress();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      if (isDisliked) {
        setDislikes(prev => prev - 1);
        setIsDisliked(false);
      }
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(prev => prev - 1);
      setIsDisliked(false);
    } else {
      if (isLiked) {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
      setDislikes(prev => prev + 1);
      setIsDisliked(true);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        username: 'User', // Replace with actual username
        timestamp: new Date(),
      };
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return 'repeat-one';
      case 'all':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.contentContainer, {opacity: fadeAnim}]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.artworkContainer}>
            <Image
              source={{uri: currentTrack.artwork}}
              style={styles.artwork}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{currentTrack.title}</Text>
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </View>

          <View style={styles.interactionContainer}>
            <TouchableOpacity
              onPress={handleLike}
              style={styles.interactionButton}>
              <Icon
                name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
                size={24}
                color={isLiked ? '#1DB954' : '#fff'}
              />
              <Text style={styles.interactionCount}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDislike}
              style={styles.interactionButton}>
              <Icon
                name={isDisliked ? 'thumbs-down' : 'thumbs-down-outline'}
                size={24}
                color={isDisliked ? '#ff4444' : '#fff'}
              />
              <Text style={styles.interactionCount}>{dislikes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCommentModal(true)}
              style={styles.interactionButton}>
              <Icon name="chatbubble-outline" size={24} color="#fff" />
              <Text style={styles.interactionCount}>{comments.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onToggleSave}
              style={styles.interactionButton}>
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isSaved ? '#1DB954' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {width: `${(progress.position / progress.duration) * 100}%`},
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(progress.position)}</Text>
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          <View style={styles.mainControls}>
            <View style={styles.secondaryControls}>
              <TouchableOpacity
                onPress={onToggleShuffle}
                style={[
                  styles.controlButton,
                  isShuffled && styles.activeControl,
                ]}>
                <Icon name="shuffle" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onPrevious}>
                <Icon name="play-skip-back" size={35} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={onPlayPause}>
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={50}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNext}>
                <Icon name="play-skip-forward" size={35} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onToggleRepeat}
                style={[
                  styles.controlButton,
                  repeatMode !== 'off' && styles.activeControl,
                ]}>
                <Icon name={getRepeatIcon()} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Modal
          visible={showCommentModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCommentModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Comments</Text>
                <TouchableOpacity
                  onPress={() => setShowCommentModal(false)}
                  style={styles.modalCloseButton}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.commentInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Add a comment..."
                  placeholderTextColor="#808080"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  style={styles.addCommentButton}>
                  <Icon name="send" size={24} color="#1DB954" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.commentsList}>
                {comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.username}>{comment.username}</Text>
                      <Text style={styles.timestamp}>
                        {comment.timestamp.toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  artwork: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 18,
    marginTop: 5,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#404040',
  },
  interactionButton: {
    alignItems: 'center',
  },
  interactionCount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  controlsContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 8,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 8,
  },
  addCommentButton: {
    padding: 8,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    backgroundColor: '#404040',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    color: '#fff',
    fontWeight: '600',
  },
  timestamp: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
  },
  mainControls: {
    marginTop: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeControl: {
    backgroundColor: '#1DB954',
    transform: [{ scale: 1.1 }],
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DB954',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  }
});

export default ExpandedPlayer;
