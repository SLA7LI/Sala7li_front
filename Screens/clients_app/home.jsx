import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Service_client from '../../api/client_service';
import manage_worker from '../../api/worker';

const WorkersScreen = () => {
  const navigation = useNavigation();
  const [workers, setWorkers] = useState([]);
  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All','Electrician', 'Painter', 'Menuiserie', 'Peinture'];
  const serviceFilters = ['All', 'Done', 'Open'];

  useEffect(() => {
    fetchWorkers();
    fetchServiceRequest();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await manage_worker.getWorkerRequests();
      setWorkers(response.workers || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      Alert.alert('Error', 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRequest = async () => {
    try {
      setServiceLoading(true);
      const response = await Service_client.getServiceRequestsClient();
      setServiceRequest(response.data || null);
    } catch (error) {
      console.error('Error fetching service request:', error);
      Alert.alert('Error', 'Failed to load service request');
    } finally {
      setServiceLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesCategory = selectedCategory === 'All' || 
      worker.worker?.genre?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.worker?.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const shouldShowServiceRequest = () => {
    if (!serviceRequest) return false;
    if (selectedServiceFilter === 'All') return true;
    if (selectedServiceFilter === 'Done') return serviceRequest.status === 'completed';
    if (selectedServiceFilter === 'Open') return serviceRequest.status === 'open';
    return true;
  };

  const handleCreateBid = () => {
    // Navigation vers l'écran de création de bid ou modal
    Alert.alert('Create Bid', 'Navigate to create bid screen');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, { color: i <= rating ? '#FFD700' : '#E0E0E0' }]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const renderWorkerCard = (worker) => (
    <View key={worker.id} style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {worker.worker?.picture ? (
              <Image source={{ uri: worker.worker.picture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerLocation}>{worker.wilaya}, {worker.baladia}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(worker.worker?.rating || 0)}
            </View>
          </View>
        </View>
        {worker.worker?.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>Bio</Text>
        <Text style={styles.bioText} numberOfLines={3}>
          {worker.worker?.bio || 'No bio available'}
        </Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsText}>
          <Text style={styles.statsNumber}>{worker.worker?.completedJobs || 0}</Text> services completed
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.genreTag}>
          <Text style={styles.genreText}>{worker.worker?.genre || 'General'}</Text>
        </View>
        <TouchableOpacity style={styles.addToBidButton}>
          <Text style={styles.addToBidText}>+ add to a bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Rendu pour la carte de service request SANS le bouton Create Bid
  const renderServiceRequestCard = () => {
    if (!serviceRequest) return null;
    
    const isCompleted = serviceRequest.status === 'completed';
    const isOpen = serviceRequest.status === 'open';
    
    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceCategory}>{serviceRequest.category}</Text>
            <View style={[
              styles.serviceStatus, 
              isCompleted ? styles.serviceStatusCompleted : 
              isOpen ? styles.serviceStatusOpen : styles.serviceStatusDefault
            ]}>
              <Text style={[
                styles.serviceStatusText,
                isCompleted ? styles.serviceStatusTextCompleted : 
                isOpen ? styles.serviceStatusTextOpen : styles.serviceStatusTextDefault
              ]}>
                {isCompleted ? 'Done' : isOpen ? 'Open' : serviceRequest.status}
              </Text>
            </View>
          </View>
          <Text style={styles.serviceBudget}>{serviceRequest.budget} DA</Text>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={3}>
          {serviceRequest.description}
        </Text>

        <View style={styles.serviceDetails}>
          <Text style={styles.serviceUrgency}>
            Urgency: <Text style={styles.serviceUrgencyValue}>{serviceRequest.urgency}</Text>
          </Text>
          <Text style={styles.serviceDate}>
            {new Date(serviceRequest.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.serviceLocation}>
          <Text style={styles.serviceLocationText}>
            📍 Lat: {serviceRequest.latitude}, Lng: {serviceRequest.longitude}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading workers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>⚡</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Find the algiers' most skilled workers</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Recommendation Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommendation</Text>
          <TouchableOpacity
            onPress={() => {
              if (filteredWorkers.length > 0) {
                navigation.navigate('WorkerDetails', { worker: filteredWorkers[0] });
              }
            }}
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Workers Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.workersContainer}
        >
          {filteredWorkers.map(renderWorkerCard)}
        </ScrollView>

        {/* Service Requests Section avec le bouton Create Bid en haut */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Requests</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* NOUVEAU: Bouton Create Bid moderne en haut de la section */}
        <View style={styles.createBidSection}>
          <TouchableOpacity style={styles.modernCreateBidButton} onPress={handleCreateBid}>
            <View style={styles.createBidButtonContent}>
              <View style={styles.createBidIconContainer}>
                <Text style={styles.createBidIcon}>✨</Text>
              </View>
              <View style={styles.createBidTextContainer}>
                <Text style={styles.createBidTitle}>Create New Bid</Text>
                <Text style={styles.createBidSubtitle}>Submit your proposal for this service</Text>
              </View>
              <View style={styles.createBidArrow}>
                <Text style={styles.createBidArrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Request Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {serviceFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.categoryButton,
                selectedServiceFilter === filter && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedServiceFilter(filter)}
            >
              <Text style={[
                styles.categoryText,
                selectedServiceFilter === filter && styles.categoryTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service Request Display */}
        <View style={styles.servicesContainer}>
          {serviceLoading ? (
            <View style={styles.servicesLoadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.servicesLoadingText}>Loading service request...</Text>
            </View>
          ) : shouldShowServiceRequest() ? (
            renderServiceRequestCard()
          ) : (
            <View style={styles.emptyServicesContainer}>
              <Text style={styles.emptyServicesText}>No service requests available</Text>
              <Text style={styles.emptyServicesSubtext}>Try adjusting your filters</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 34,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#8E8E93',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1D1D1F',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 18,
    color: '#8E8E93',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  workersContainer: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  workerCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  workerLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginRight: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#34C759',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bioSection: {
    marginBottom: 12,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  statsSection: {
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsNumber: {
    color: '#007AFF',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  addToBidButton: {
    flex: 1,
    marginLeft: 10,
  },
  addToBidText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'right',
  },
  
  // NOUVEAUX STYLES POUR LE BOUTON CREATE BID MODERNE
  createBidSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modernCreateBidButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  createBidButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createBidIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  createBidIcon: {
    fontSize: 24,
    color: 'white',
  },
  createBidTextContainer: {
    flex: 1,
  },
  createBidTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  createBidSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  createBidArrow: {
    width: 32,
    height: 32,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBidArrowText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  
  // STYLES POUR LES SERVICE REQUESTS (sans le bouton Create Bid)
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginRight: 12,
  },
  serviceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceStatusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  serviceStatusOpen: {
    backgroundColor: '#DBEAFE',
  },
  serviceStatusDefault: {
    backgroundColor: '#FEF3C7',
  },
  serviceStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  serviceStatusTextCompleted: {
    color: '#065F46',
  },
  serviceStatusTextOpen: {
    color: '#1E40AF',
  },
  serviceStatusTextDefault: {
    color: '#92400E',
  },
  serviceBudget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceUrgency: {
    fontSize: 12,
    color: '#8E8E93',
  },
  serviceUrgencyValue: {
    fontWeight: '600',
    color: '#1D1D1F',
  },
  serviceDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  serviceLocation: {
    marginBottom: 0, // Retiré la marge du bas car plus de bouton
  },
  serviceLocationText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  servicesLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  servicesLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyServicesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyServicesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  emptyServicesSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default WorkersScreen;