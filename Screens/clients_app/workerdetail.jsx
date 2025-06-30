import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import manage_worker from '../../api/worker';

const AllWorkersScreen = ({ navigation, route }) => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || 'All');

  const categories = ['All', 'Plombier', 'Electricien', 'Menuiserie', 'Peintre'];

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workers, searchQuery, selectedCategory]);

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

  const applyFilters = () => {
    let filtered = [...workers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.worker?.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.wilaya.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const categoryMap = {
        'Plombier': 'plumber',
        'Electricien': 'electrician',
        'Menuisier': 'carpenter',
        'Peintre': 'painter'
      };
      
      const mappedCategory = categoryMap[selectedCategory] || selectedCategory.toLowerCase();
      filtered = filtered.filter(worker =>
        worker.worker?.genre?.toLowerCase().includes(mappedCategory)
      );
    }

    setFilteredWorkers(filtered);
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

  const getYearsAgo = (createdAt) => {
    if (!createdAt) return 1;
    const created = new Date(createdAt);
    const now = new Date();
    const years = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years || 1;
  };

  const getGenreInFrench = (genre) => {
    const genreMap = {
      'electrician': 'Electricien',
      'plumber': 'Plombier',
      'carpenter': 'Menuisier',
      'painter': 'Peintre'
    };
    return genreMap[genre?.toLowerCase()] || genre || 'Général';
  };

  const renderWorkerCard = ({ item: worker }) => (
    <TouchableOpacity 
      style={styles.workerCard}
      onPress={() => navigation.navigate('WorkerDetails', { worker })}
    >
      <View style={styles.workerHeader}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
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
            <Text style={styles.workerLocation}>{worker.wilaya} {worker.baladia}</Text>
            
            <View style={styles.ratingContainer}>
              {renderStars(worker.worker?.rating || 0)}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>Bio</Text>
        <View style={styles.bioDetails}>
          <Text style={styles.bioStats}>
            <Text style={styles.bioStatsHighlight}>
              {getYearsAgo(worker.worker?.createdAt)} years ago
            </Text>
            <Text style={styles.bioStatsSeparator}> • </Text>
            <Text style={styles.bioStatsNumber}>{worker.worker?.completedJobs || 0}</Text>
            <Text> services</Text>
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.genreTag}>
          <Text style={styles.genreText}>{getGenreInFrench(worker.worker?.genre)}</Text>
        </View>
        <TouchableOpacity style={styles.addToBidButton}>
          <Text style={styles.addToBidText}>+ add to a bidding</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoIcon} />
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Workers</Text>

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

      {/* Category Filters */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </View>

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        renderItem={renderWorkerCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workers found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />


      
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
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D1D1F',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 15,
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  workerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workerHeader: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  workerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  workerLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  bioSection: {
    marginBottom: 16,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  bioDetails: {
    marginBottom: 4,
  },
  bioStats: {
    fontSize: 14,
    color: '#8E8E93',
  },
  bioStatsHighlight: {
    color: '#007AFF',
    fontWeight: '500',
  },
  bioStatsSeparator: {
    color: '#8E8E93',
  },
  bioStatsNumber: {
    color: '#1D1D1F',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  addToBidButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  addToBidText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 34, // For iPhone safe area
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // Active state styling
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#8E8E93',
  },
  navIconActive: {
    color: '#007AFF',
  },
  navText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#007AFF',
  },
});

export default AllWorkersScreen;