"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import Service_client from "../../api/client_service"

import LobbyModal from "@/components/clientlobymodal"
import CreateServiceRequestModal from "../../components/modal"


const AllServiceRequestsScreen = () => {
  const navigation = useNavigation()
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showClientLobby, setShowClientLobby] = useState(false)
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null)

  const statusFilters = ["All", "Open", "In Progress", "Done", "Closed"]
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
      (selectedFilter === "In Progress" && request.status === "in_progress") ||
      (selectedFilter === "Done" && request.status === "closed") ||
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

  const handleServiceRequestPress = (request) => {
    setSelectedServiceRequest(request)
    setShowClientLobby(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return { backgroundColor: "#DBEAFE", textColor: "#1E40AF", text: "Open" }
      case "in_progress":
        return { backgroundColor: "#FEF3C7", textColor: "#92400E", text: "In Progress" }
      case "closed":
        return { backgroundColor: "#D1FAE5", textColor: "#065F46", text: "Done" }
      default:
        return { backgroundColor: "#F3F4F6", textColor: "#6B7280", text: status }
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

  const renderServiceRequestCard = (request) => {
    const statusInfo = getStatusColor(request.status)
    const participantsCount = request.participants?.length || 0
    const hasOffers = participantsCount > 0
    const pendingOffers = request.participants?.filter((p) => p.status === "pending")?.length || 0
    const acceptedOffers = request.participants?.filter((p) => p.status === "accepted")?.length || 0

    return (
      <TouchableOpacity
        key={request.id}
        style={[styles.serviceCard, hasOffers && styles.serviceCardWithOffers]}
        onPress={() => handleServiceRequestPress(request)}
        activeOpacity={0.7}
      >
        {/* Priority indicator for urgent requests */}
        {request.urgency === "urgent" && (
          <View style={styles.urgentIndicator}>
            <Text style={styles.urgentText}>🚨 URGENT</Text>
          </View>
        )}

        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceCategory}>{request.category}</Text>
            <View style={[styles.serviceStatus, { backgroundColor: statusInfo.backgroundColor }]}>
              <Text style={[styles.serviceStatusText, { color: statusInfo.textColor }]}>{statusInfo.text}</Text>
            </View>
          </View>
          <Text style={styles.serviceBudget}>{request.budget} DA</Text>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={3}>
          {request.description}
        </Text>

        <View style={styles.serviceDetails}>
          <Text style={styles.serviceUrgency}>
            Urgency:{" "}
            <Text style={[styles.serviceUrgencyValue, { color: getUrgencyColor(request.urgency) }]}>
              {request.urgency}
            </Text>
          </Text>
          <Text style={styles.serviceDate}>{new Date(request.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.serviceLocation}>
          <Text style={styles.serviceLocationText}>
            📍 Lat: {request.latitude?.toFixed(4)}, Lng: {request.longitude?.toFixed(4)}
          </Text>
        </View>

        {/* Enhanced Participants Section */}
        <View style={styles.participantsSection}>
          <View style={[styles.participantsIndicator, hasOffers && styles.participantsIndicatorActive]}>
            <View style={styles.participantsLeft}>
              <Text style={[styles.participantsText, hasOffers && styles.participantsTextActive]}>
                👥 {participantsCount} worker{participantsCount !== 1 ? "s" : ""} interested
              </Text>
              {hasOffers && (
                <View style={styles.offerBreakdown}>
                  {pendingOffers > 0 && <Text style={styles.offerBreakdownText}>{pendingOffers} pending</Text>}
                  {acceptedOffers > 0 && (
                    <Text style={styles.offerBreakdownTextAccepted}>{acceptedOffers} accepted</Text>
                  )}
                </View>
              )}
            </View>
            {hasOffers && (
              <View style={styles.participantsRight}>
                <Text style={styles.tapToViewText}>Tap to manage offers</Text>
                <Text style={styles.arrowText}>→</Text>
              </View>
            )}
          </View>

          {/* Show top participants preview */}
          {hasOffers && (
            <View style={styles.participantPreview}>
              {request.participants.slice(0, 3).map((participant, index) => {
                const statusColor = getStatusColor(participant.status)
                return (
                  <View key={index} style={styles.participantPreviewItem}>
                    <View style={[styles.participantStatusDot, { backgroundColor: statusColor.textColor }]} />
                    <Text style={styles.participantPreviewText} numberOfLines={1}>
                      {participant.worker?.user?.name || "Worker"}
                      {participant.bid > 0 && ` - ${participant.bid} DA`}
                    </Text>
                  </View>
                )
              })}
              {participantsCount > 3 && (
                <Text style={styles.moreParticipantsText}>+{participantsCount - 3} more...</Text>
              )}
            </View>
          )}
        </View>

        {/* Action buttons for open requests */}
        {request.status === "open" && (
          <View style={styles.serviceActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation()
                // Handle edit action
                Alert.alert("Edit", "Edit functionality to be implemented")
              }}
            >
              <Text style={styles.editButtonText}>Edit Request</Text>
            </TouchableOpacity>
            {hasOffers && (
              <TouchableOpacity style={styles.manageOffersButton} onPress={() => handleServiceRequestPress(request)}>
                <Text style={styles.manageOffersText}>Manage Offers</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
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

  // Calculate statistics
  const totalRequests = serviceRequests.length
  const openRequests = serviceRequests.filter((r) => r.status === "open").length
  const inProgressRequests = serviceRequests.filter((r) => r.status === "in_progress").length
  const completedRequests = serviceRequests.filter((r) => r.status === "closed").length
  const requestsWithOffers = serviceRequests.filter((r) => r.participants?.length > 0).length

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Service Requests</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalRequests}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{openRequests}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{requestsWithOffers}</Text>
            <Text style={styles.statLabel}>With Offers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedRequests}</Text>
            <Text style={styles.statLabel}>Done</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersContainer}>
              {statusFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Category Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {/* Service Requests List */}
        <View style={styles.servicesContainer}>
          {filteredRequests.length > 0 ? filteredRequests.map(renderServiceRequestCard) : renderEmptyState()}
        </View>
      </ScrollView>

      {/* Create Service Request Modal */}
      <CreateServiceRequestModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Client Lobby Modal */}
      <LobbyModal
        visible={showClientLobby}
        onClose={() => {
          setShowClientLobby(false)
          setSelectedServiceRequest(null)
        }}
        serviceRequest={selectedServiceRequest}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 20,
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 16,
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
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 8,
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
  servicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    position: "relative",
  },
  serviceCardWithOffers: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  urgentIndicator: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  urgentText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
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
  participantsSection: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginBottom: 12,
  },
  participantsIndicator: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  participantsIndicatorActive: {
    backgroundColor: "#E3F2FD",
  },
  participantsLeft: {
    flex: 1,
  },
  participantsText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  participantsTextActive: {
    color: "#1976D2",
  },
  offerBreakdown: {
    flexDirection: "row",
    marginTop: 4,
  },
  offerBreakdownText: {
    fontSize: 10,
    color: "#F59E0B",
    marginRight: 8,
    fontWeight: "500",
  },
  offerBreakdownTextAccepted: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "500",
  },
  participantsRight: {
    alignItems: "flex-end",
  },
  tapToViewText: {
    fontSize: 11,
    color: "#1976D2",
    fontStyle: "italic",
  },
  arrowText: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "bold",
    marginTop: 2,
  },
  participantPreview: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 8,
  },
  participantPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  participantStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  participantPreviewText: {
    fontSize: 11,
    color: "#8E8E93",
    flex: 1,
  },
  moreParticipantsText: {
    fontSize: 10,
    color: "#007AFF",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
  serviceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    textAlign: "center",
  },
  manageOffersButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  manageOffersText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
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
