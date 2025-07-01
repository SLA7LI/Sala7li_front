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
import { getWorkerServiceRequests } from "../..//api/get_services_request_by worker"

const AllWorkerServiceRequestsScreen = () => {
  const navigation = useNavigation()
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const statusFilters = ["All", "Pending", "Bidding", "Accepted", "Completed"]
  const categories = ["All", "Plumber", "Electrician", "Painter", "Carpenter", "Mechanic", "Cleaner"]

  useEffect(() => {
    fetchServiceRequests()
  }, [])

  const fetchServiceRequests = async () => {
    try {
      setLoading(true)
      const response = await getWorkerServiceRequests()
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
      (selectedFilter === "Pending" && request.status === "pending") ||
      (selectedFilter === "Bidding" && request.status === "bidding") ||
      (selectedFilter === "Accepted" && request.status === "accepted") ||
      (selectedFilter === "Completed" && request.clientCompleted && request.workerCompleted)

    const matchesCategory =
      selectedCategory === "All" ||
      request.serviceRequest.category.toLowerCase().includes(selectedCategory.toLowerCase())

    const matchesSearch =
      request.serviceRequest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.serviceRequest.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  const getStatusColor = (status, clientCompleted, workerCompleted) => {
    if (clientCompleted && workerCompleted) {
      return {
        backgroundColor: "#D1FAE5",
        textColor: "#065F46",
        text: "Completed",
      }
    }
    switch (status) {
      case "pending":
        return {
          backgroundColor: "#FEF3C7",
          textColor: "#92400E",
          text: "Pending",
        }
      case "bidding":
        return {
          backgroundColor: "#DBEAFE",
          textColor: "#1E40AF",
          text: "Bidding",
        }
      case "accepted":
        return {
          backgroundColor: "#D1FAE5",
          textColor: "#065F46",
          text: "Accepted",
        }
      default:
        return {
          backgroundColor: "#F3F4F6",
          textColor: "#6B7280",
          text: status,
        }
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "#EF4444"
      case "high":
        return "#F59E0B"
      case "medium":
        return "#10B981"
      case "low":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const renderServiceRequestCard = ({ item: request }) => {
    const statusInfo = getStatusColor(request.status, request.clientCompleted, request.workerCompleted)
    const serviceRequest = request.serviceRequest

    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceCategory}>{serviceRequest.category}</Text>
            <View style={[styles.serviceStatus, { backgroundColor: statusInfo.backgroundColor }]}>
              <Text style={[styles.serviceStatusText, { color: statusInfo.textColor }]}>{statusInfo.text}</Text>
            </View>
          </View>
          <Text style={styles.serviceBudget}>{serviceRequest.budget} DA</Text>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={3}>
          {serviceRequest.description}
        </Text>

        <View style={styles.serviceDetails}>
          <Text style={styles.serviceUrgency}>
            Urgency:{" "}
            <Text style={[styles.serviceUrgencyValue, { color: getUrgencyColor(serviceRequest.urgency) }]}>
              {serviceRequest.urgency}
            </Text>
          </Text>
          <Text style={styles.serviceDate}>{new Date(request.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.serviceLocation}>
          <Text style={styles.serviceLocationText}>
            📍 Lat: {serviceRequest.latitude.toFixed(4)}, Lng: {serviceRequest.longitude.toFixed(4)}
          </Text>
        </View>

        <View style={styles.serviceFooter}>
          <View style={styles.serviceSource}>
            <Text style={styles.serviceSourceText}>Source: {request.source}</Text>
          </View>
          <View style={styles.serviceActions}>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("ServiceRequestDetails", { request })}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
            {request.status === "pending" && (
              <TouchableOpacity style={styles.bidButton}>
                <Text style={styles.bidButtonText}>Place Bid</Text>
              </TouchableOpacity>
            )}
          </View>
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
          : "You haven't received any service requests yet"}
      </Text>
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
        <View style={styles.headerRight}>
          <Text style={styles.requestCount}>{filteredRequests.length}</Text>
        </View>
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
        keyExtractor={(item) => item.serviceRequestId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
  headerRight: {
    width: 40,
    alignItems: "center",
  },
  requestCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
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
  serviceStatusText: {
    fontSize: 12,
    fontWeight: "500",
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
    textTransform: "capitalize",
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
  serviceFooter: {
    flexDirection: "column",
    gap: 8,
  },
  serviceSource: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  serviceSourceText: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "capitalize",
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
  bidButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bidButtonText: {
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
  },
})

export default AllWorkerServiceRequestsScreen
