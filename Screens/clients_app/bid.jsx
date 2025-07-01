"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import Service_client from "../../api/client_service"
import CreateServiceRequestModal from "../../components/modal"

const AllServiceRequestsScreen = () => {
  const navigation = useNavigation()
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const statusFilters = ["All", "Open", "Closed"]
  const categories = ["All", "Plumber", "Electrician", "Painter", "Carpenter", "Mechanic", "Cleaner"]

  useEffect(() => {
    fetchServiceRequests()
  }, [])

  const fetchServiceRequests = async () => {
    try {
      setLoading(true)
      const response = await Service_client.getServiceRequestsClient()
      setServiceRequests(response.data || [])
    } catch (error) {
      console.error("Error fetching service requests:", error)
      Alert.alert("Error", "Failed to load service requests")
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesStatus =
      selectedFilter === "All" ||
      (selectedFilter === "Open" && request.status === "open") ||
      (selectedFilter === "Closed" && request.status === "closed")

    const matchesCategory =
      selectedCategory === "All" || request.category.toLowerCase().includes(selectedCategory.toLowerCase())

    const matchesSearch =
      request.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  const handleCreateRequest = () => {
    setShowCreateModal(true)
  }

  const handleModalSuccess = () => {
    fetchServiceRequests()
  }

  const renderServiceRequestCard = ({ item: request }) => {
    const isCompleted = request.status === "closed"
    const isOpen = request.status === "open"

    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceCategory}>{request.category}</Text>
            <View
              style={[
                styles.serviceStatus,
                isCompleted
                  ? styles.serviceStatusCompleted
                  : isOpen
                    ? styles.serviceStatusOpen
                    : styles.serviceStatusDefault,
              ]}
            >
              <Text
                style={[
                  styles.serviceStatusText,
                  isCompleted
                    ? styles.serviceStatusTextCompleted
                    : isOpen
                      ? styles.serviceStatusTextOpen
                      : styles.serviceStatusTextDefault,
                ]}
              >
                {isCompleted ? "Closed" : isOpen ? "Open" : request.status}
              </Text>
            </View>
          </View>
          <Text style={styles.serviceBudget}>{request.budget} DA</Text>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={3}>
          {request.description}
        </Text>

        <View style={styles.serviceDetails}>
          <Text style={styles.serviceUrgency}>
            Urgency: <Text style={styles.serviceUrgencyValue}>{request.urgency}</Text>
          </Text>
          <Text style={styles.serviceDate}>{new Date(request.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.serviceLocation}>
          <Text style={styles.serviceLocationText}>
            📍 Lat: {request.latitude.toFixed(4)}, Lng: {request.longitude.toFixed(4)}
          </Text>
        </View>

        <View style={styles.serviceActions}>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
          {isOpen && (
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Service Requests Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFilter !== "All" || selectedCategory !== "All"
          ? "Try adjusting your filters or search terms"
          : "Create your first service request to get started"}
      </Text>
      <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateRequest}>
        <Text style={styles.createFirstButtonText}>Create Service Request</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading service requests...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Service Requests</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.filtersContainer}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Category:</Text>
        <View style={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {/* Service Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderServiceRequestCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Create Service Request Modal */}
      <CreateServiceRequestModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: "#8E8E93",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1D1D1F",
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "white",
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginRight: 12,
  },
  serviceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceStatusCompleted: {
    backgroundColor: "#D1FAE5",
  },
  serviceStatusOpen: {
    backgroundColor: "#DBEAFE",
  },
  serviceStatusDefault: {
    backgroundColor: "#FEF3C7",
  },
  serviceStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  serviceStatusTextCompleted: {
    color: "#065F46",
  },
  serviceStatusTextOpen: {
    color: "#1E40AF",
  },
  serviceStatusTextDefault: {
    color: "#92400E",
  },
  serviceBudget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceUrgency: {
    fontSize: 12,
    color: "#8E8E93",
  },
  serviceUrgencyValue: {
    fontWeight: "600",
    color: "#1D1D1F",
  },
  serviceDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  serviceLocation: {
    marginBottom: 12,
  },
  serviceLocationText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  serviceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
})

export default AllServiceRequestsScreen
