"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import { getWorkerServiceRequests } from "../../api/get_services_request_by worker"
import { joinBidding } from "../../api/joinBinding"

const { width, height } = Dimensions.get("window")

// Success Modal Component
const JoinBiddingModal = ({ visible, onClose, onSuccess, serviceRequest }) => {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.iconContainer}>
            <View style={modalStyles.successIcon}>
              <Text style={modalStyles.successIconText}>✓</Text>
            </View>
          </View>

          <Text style={modalStyles.title}>Successfully Joined!</Text>
          <Text style={modalStyles.message}>
            You have successfully joined the bidding for this {serviceRequest?.category || "service"} request.
          </Text>

          <View style={modalStyles.serviceInfo}>
            <Text style={modalStyles.serviceCategory}>{serviceRequest?.category}</Text>
            <Text style={modalStyles.serviceBudget}>{serviceRequest?.budget} DA</Text>
          </View>

          <Text style={modalStyles.nextSteps}>
            You will be notified when the client reviews your application and other bids.
          </Text>

          <TouchableOpacity style={modalStyles.continueButton} onPress={handleSuccess} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={modalStyles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

// Main Map Screen Component
const ServiceRequestsMapScreen = () => {
  const navigation = useNavigation()
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null)
  const [joiningBid, setJoiningBid] = useState(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 36.7538, // Alger par défaut
    longitude: 3.0588,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  })

  const statusFilters = ["All", "Pending", "Bidding", "Accepted", "Completed"]

  useEffect(() => {
    fetchServiceRequests()
  }, [])

  const fetchServiceRequests = async () => {
    try {
      setLoading(true)
      const response = await getWorkerServiceRequests()
      setServiceRequests(response.data || [])

      // Ajuster la région de la carte selon les service requests
      if (response.data && response.data.length > 0) {
        const latitudes = response.data.map((req) => req.serviceRequest.latitude)
        const longitudes = response.data.map((req) => req.serviceRequest.longitude)

        const minLat = Math.min(...latitudes)
        const maxLat = Math.max(...latitudes)
        const minLng = Math.min(...longitudes)
        const maxLng = Math.max(...longitudes)

        const centerLat = (minLat + maxLat) / 2
        const centerLng = (minLng + maxLng) / 2
        const deltaLat = (maxLat - minLat) * 1.2 || 0.1
        const deltaLng = (maxLng - minLng) * 1.2 || 0.1

        setMapRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: Math.max(deltaLat, 0.1),
          longitudeDelta: Math.max(deltaLng, 0.1),
        })
      }
    } catch (error) {
      console.error("Error fetching service requests:", error)
      Alert.alert("Error", "Failed to load service requests")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinBidding = async (request) => {
    try {
      setJoiningBid(request.serviceRequestId)
      await joinBidding(request.serviceRequest.id)
      setSelectedServiceRequest(request.serviceRequest)
      setShowSuccessModal(true)
      fetchServiceRequests()
    } catch (error) {
      console.error("Error joining bidding:", error)
      Alert.alert("Error", error.response?.data?.message || "Failed to join bidding. Please try again.")
    } finally {
      setJoiningBid(null)
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

  const getMarkerColor = (status, clientCompleted, workerCompleted) => {
    if (clientCompleted && workerCompleted) {
      return "#34C759" // Vert pour completed
    }
    switch (status) {
      case "pending":
        return "#FF9500" // Orange pour pending
      case "bidding":
        return "#007AFF" // Bleu pour bidding
      case "accepted":
        return "#AF52DE" // Violet pour accepted
      default:
        return "#8E8E93" // Gris par défaut
    }
  }

  const getStatusInfo = (status, clientCompleted, workerCompleted) => {
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
          backgroundColor: "#E9D5FF",
          textColor: "#7C3AED",
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

  const renderCalloutActions = (request) => {
    const isCompleted = request.clientCompleted && request.workerCompleted
    const isPending = request.status === "pending"
    const isJoining = joiningBid === request.serviceRequestId

    if (isCompleted) {
      return (
        <TouchableOpacity
          style={styles.calloutViewButton}
          onPress={() => navigation.navigate("ServiceRequestDetails", { request })}
        >
          <Text style={styles.calloutViewButtonText}>View Details</Text>
        </TouchableOpacity>
      )
    }

    if (isPending) {
      return (
        <TouchableOpacity
          style={[styles.calloutViewButton, styles.calloutJoinButton]}
          onPress={() => handleJoinBidding(request)}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.calloutJoinButtonText}>Join Bidding</Text>
          )}
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={styles.calloutViewButton}
        onPress={() => navigation.navigate("ServiceRequestDetails", { request })}
      >
        <Text style={styles.calloutViewButtonText}>View Details</Text>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading service requests map...</Text>
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
        <Text style={styles.headerTitle}>Service Requests Map</Text>
        <View style={styles.headerRight}>
          <Text style={styles.requestCount}>{filteredRequests.length}</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search service requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Status Filters */}
      <View style={styles.categoriesContainer}>
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.categoryButton, selectedFilter === filter && styles.categoryButtonActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.categoryText, selectedFilter === filter && styles.categoryTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion} onRegionChangeComplete={setMapRegion}>
          {filteredRequests.map((request) => {
            const serviceRequest = request.serviceRequest
            const statusInfo = getStatusInfo(request.status, request.clientCompleted, request.workerCompleted)

            return (
              <Marker
                key={request.serviceRequestId}
                coordinate={{
                  latitude: serviceRequest.latitude,
                  longitude: serviceRequest.longitude,
                }}
                pinColor={getMarkerColor(request.status, request.clientCompleted, request.workerCompleted)}
              >
                <Callout style={styles.callout}>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutHeader}>
                      <View style={styles.calloutServiceInfo}>
                        <Text style={styles.calloutServiceCategory}>{serviceRequest.category}</Text>
                        <View style={[styles.calloutServiceStatus, { backgroundColor: statusInfo.backgroundColor }]}>
                          <Text style={[styles.calloutServiceStatusText, { color: statusInfo.textColor }]}>
                            {statusInfo.text}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.calloutServiceBudget}>{serviceRequest.budget} DA</Text>
                    </View>

                    <Text style={styles.calloutDescription} numberOfLines={3}>
                      {serviceRequest.description}
                    </Text>

                    <View style={styles.calloutDetails}>
                      <Text style={styles.calloutUrgency}>
                        Urgency:{" "}
                        <Text style={[styles.calloutUrgencyValue, { color: getUrgencyColor(serviceRequest.urgency) }]}>
                          {serviceRequest.urgency}
                        </Text>
                      </Text>
                      <Text style={styles.calloutDate}>{new Date(request.createdAt).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.calloutLocation}>
                      <Text style={styles.calloutLocationText}>
                        📍 {serviceRequest.latitude.toFixed(4)}, {serviceRequest.longitude.toFixed(4)}
                      </Text>
                    </View>

                    <View style={styles.calloutFooter}>
                      <View style={styles.calloutSource}>
                        <Text style={styles.calloutSourceText}>Source: {request.source}</Text>
                      </View>
                    </View>

                    <View style={styles.calloutActions}>{renderCalloutActions(request)}</View>
                  </View>
                </Callout>
              </Marker>
            )
          })}
        </MapView>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Status Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#FF9500" }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#007AFF" }]} />
            <Text style={styles.legendText}>Bidding</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#AF52DE" }]} />
            <Text style={styles.legendText}>Accepted</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#34C759" }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Success Modal */}
      <JoinBiddingModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSelectedServiceRequest(null)
        }}
        onSuccess={() => {
          setShowSuccessModal(false)
          setSelectedServiceRequest(null)
        }}
        serviceRequest={selectedServiceRequest}
      />
    </SafeAreaView>
  )
}

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
  },
  successIconText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  serviceInfo: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceCategory: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  serviceBudget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  nextSteps: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})

// Main Styles
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: "#8E8E93",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1D1D1F",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "white",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    width: 300,
  },
  calloutContainer: {
    padding: 12,
  },
  calloutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  calloutServiceInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  calloutServiceCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginRight: 8,
  },
  calloutServiceStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  calloutServiceStatusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  calloutServiceBudget: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  calloutDescription: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  calloutUrgency: {
    fontSize: 10,
    color: "#8E8E93",
  },
  calloutUrgencyValue: {
    fontWeight: "600",
    textTransform: "capitalize",
  },
  calloutDate: {
    fontSize: 10,
    color: "#8E8E93",
  },
  calloutLocation: {
    marginBottom: 6,
  },
  calloutLocationText: {
    fontSize: 10,
    color: "#8E8E93",
  },
  calloutFooter: {
    marginBottom: 8,
  },
  calloutSource: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  calloutSourceText: {
    fontSize: 10,
    color: "#8E8E93",
    textTransform: "capitalize",
  },
  calloutActions: {
    alignItems: "center",
  },
  calloutViewButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutJoinButton: {
    backgroundColor: "#34C759",
  },
  calloutViewButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  calloutJoinButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  legend: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: "column",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: "#8E8E93",
  },
})

export default ServiceRequestsMapScreen
