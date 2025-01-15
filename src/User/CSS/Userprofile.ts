import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  datePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  datePickerButtonText: {
    color: '#333',
    fontSize: 16,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginBottom: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    color: '#999',
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    color: '#ff0000',
    fontSize: 16,
  },
  form: {
    gap: 15,
  },
  label: {
    color: '#999',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  bioInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#333',
  },
  saveButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContent: {
    gap: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    color: '#999',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;
