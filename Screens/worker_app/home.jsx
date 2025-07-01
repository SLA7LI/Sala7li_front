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
import { getWorkerServiceRequests } from "../../api/get_services_request_by worker"
import { joinBidding } from "../../api/joinBinding"
import JoinBiddingModal from "../../components/joinmadal"
import LobbyModal from "../../components/lobymodal"

const WorkerHomeScreen = () => {
  const navigation = useNavigation()
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null)
  const [joiningBid, setJoiningBid] = useState(null)
  const [showLobbyModal, setShowLobbyModal] = useState(false)
  const [selectedLobbyRequest, setSelectedLobbyRequest] = useState(null)

  const statusFilters = ["All", "Pending", "Bidding", "Accepted", "Completed"]

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

  // Filtrer les service requests
  const filteredRequests = serviceRequests.filter((request) => {
    const matchesStatus =
      selectedFilter === "All" ||
      (selectedFilter === "Pending" && request.status === "pending") ||
      (selectedFilter === "Bidding" && request.status === "bidding") ||
      (selectedFilter === "Accepted" && request.status === "accepted") ||
      (selectedFilter === "Completed" && request.clientCompleted && request.workerCompleted)

    const matchesSearch =
      request.serviceRequest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.serviceRequest.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Afficher seulement les 2 premières recommandations
  const displayedRequests = filteredRequests.slice(0, 2)

  const handleViewAllRequests = () => {
    navigation.navigate("AllWorkerServiceRequests")
  }

  const handleJoinBidding = async (request) => {
    try {
      setJoiningBid(request.serviceRequestId)
      await joinBidding(request.serviceRequest.id)

      // Ouvrir le lobby après avoir rejoint avec succès
      setSelectedLobbyRequest(request)
      setShowLobbyModal(true)

      // Rafraîchir les données après succès
      fetchServiceRequests()
    } catch (error) {
      console.error("Error joining bidding:", error)
      Alert.alert("Error", error.response?.data?.message || "Failed to join bidding. Please try again.", [
        { text: "OK" },
      ])
    } finally {
      setJoiningBid(null)
    }
  }

  const handleViewDetails = (request) => {
    // Ouvrir le lobby pour voir les détails et négocier
    setSelectedLobbyRequest(request)
    setShowLobbyModal(true)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setSelectedServiceRequest(null)
  }

  const handleLobbyClose = () => {
    setShowLobbyModal(false)
    setSelectedLobbyRequest(null)
    // Rafraîchir les données quand on ferme le lobby
    fetchServiceRequests()
  }

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

  const renderActionButton = (request) => {
    const isCompleted = request.clientCompleted && request.workerCompleted
    const isPending = request.status === "pending"
    const isJoining = joiningBid === request.serviceRequestId

    if (isCompleted) {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDetails(request)}>
          <Text style={styles.actionButtonText}>Enter Lobby</Text>
        </TouchableOpacity>
      )
    }

    if (isPending) {
      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={() => handleJoinBidding(request)}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.actionButtonText}>Join</Text>
          )}
        </TouchableOpacity>
      )
    }

    // Pour les autres statuts (bidding, accepted, etc.)
    return (
      <TouchableOpacity style={[styles.actionButton, styles.lobbyButton]} onPress={() => handleViewDetails(request)}>
        <Text style={styles.actionButtonText}>Enter Lobby</Text>
      </TouchableOpacity>
    )
  }

  const renderServiceRequestCard = (request) => {
    const statusInfo = getStatusColor(request.status, request.clientCompleted, request.workerCompleted)
    const serviceRequest = request.serviceRequest

    return (
      <View key={request.serviceRequestId} style={styles.serviceCard}>
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
          {renderActionButton(request)}
        </View>
      </View>
    )
  }

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
   

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search service requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Your service opportunities</Text>

        {/* Recommendations Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <TouchableOpacity onPress={handleViewAllRequests}>
            <Text style={styles.viewAllText}>View all ({serviceRequests.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Status Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.categoryButton, selectedFilter === filter && styles.categoryButtonActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.categoryText, selectedFilter === filter && styles.categoryTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service Requests Display */}
        <View style={styles.servicesContainer}>
          {displayedRequests.length > 0 ? (
            displayedRequests.map(renderServiceRequestCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Service Requests</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedFilter !== "All"
                  ? "Try adjusting your filters"
                  : "You haven't received any service requests yet"}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{serviceRequests.length}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{serviceRequests.filter((r) => r.status === "pending").length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {serviceRequests.filter((r) => r.clientCompleted && r.workerCompleted).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <JoinBiddingModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        onSuccess={handleSuccessModalClose}
        serviceRequest={selectedServiceRequest}
      />

      {/* Lobby Modal */}
      <LobbyModal
        visible={showLobbyModal}
        onClose={handleLobbyClose}
        serviceRequest={selectedLobbyRequest?.serviceRequest}
        workerRequest={selectedLobbyRequest}
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
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  notificationButton: {
    position: "relative",
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D1D1F",
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 34,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 30,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  viewAllText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "white",
  },
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceSource: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceSourceText: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "capitalize",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButton: {
    backgroundColor: "#34C759",
  },
  lobbyButton: {
    backgroundColor: "#FF9500",
  },
  disabledButton: {
    backgroundColor: "#8E8E93",
  },
  actionButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
})

export default WorkerHomeScreen
