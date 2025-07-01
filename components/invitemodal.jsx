import { useState } from "react"
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { inviteWorkerToServiceRequest } from "../api/inviteclient"

const InviteWorkerModal = ({ visible, onClose, worker, serviceRequests, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState(null)

  // Filtrer seulement les service requests ouverts
  const openServiceRequests = serviceRequests.filter((request) => request.status === "open")

  const handleInviteWorker = async () => {
    if (!selectedServiceId) {
      Alert.alert("Error", "Please select a service request first")
      return
    }

    try {
      setLoading(true)
      await inviteWorkerToServiceRequest(selectedServiceId, worker.id)

      Alert.alert("Success", `${worker.name} has been invited to the service request!`, [
        {
          text: "OK",
          onPress: () => {
            onSuccess && onSuccess()
            handleClose()
          },
        },
      ])
    } catch (error) {
      console.error("Error inviting worker:", error)
      Alert.alert("Error", error.response?.data?.message || "Failed to invite worker to service request")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedServiceId(null)
    onClose()
  }

  const renderServiceRequestItem = ({ item: request }) => {
    const isSelected = selectedServiceId === request.id

    return (
      <TouchableOpacity
        style={[styles.serviceRequestItem, isSelected && styles.serviceRequestItemSelected]}
        onPress={() => setSelectedServiceId(request.id)}
      >
        <View style={styles.serviceRequestHeader}>
          <View style={styles.serviceRequestInfo}>
            <Text style={styles.serviceRequestCategory}>{request.category}</Text>
            <View style={styles.serviceRequestStatus}>
              <Text style={styles.serviceRequestStatusText}>Open</Text>
            </View>
          </View>
          {/* Prix supprimé ici */}
          {/* <Text style={styles.serviceRequestBudget}>{request.budget} DA</Text> */}
        </View>

        <Text style={styles.serviceRequestDescription} numberOfLines={2}>
          {request.description}
        </Text>

        <View style={styles.serviceRequestDetails}>
          <Text style={styles.serviceRequestUrgency}>
            Urgency: <Text style={styles.serviceRequestUrgencyValue}>{request.urgency}</Text>
          </Text>
          <Text style={styles.serviceRequestDate}>{new Date(request.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.serviceRequestLocation}>
          <Text style={styles.serviceRequestLocationText}>
            📍 Lat: {request.latitude.toFixed(4)}, Lng: {request.longitude.toFixed(4)}
          </Text>
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIndicatorText}>✓ Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Open Service Requests</Text>
      <Text style={styles.emptySubtitle}>You need to have open service requests to invite workers</Text>
    </View>
  )

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invite Worker</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Worker Info */}
        <View style={styles.workerInfo}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerAvatarText}>
              {worker?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "W"}
            </Text>
          </View>
          <View style={styles.workerDetails}>
            <Text style={styles.workerName}>{worker?.name || "Unknown Worker"}</Text>
            <Text style={styles.workerGenre}>{worker?.worker?.genre || "General"}</Text>
            <Text style={styles.workerLocation}>
              {worker?.wilaya}, {worker?.baladia}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Select a Service Request</Text>
          <Text style={styles.instructionsText}>
            Choose which service request you want to invite {worker?.name?.split(" ")[0]} to work on.
          </Text>
        </View>

        {/* Service Requests List */}
        <View style={styles.listContainer}>
          <FlatList
            data={openServiceRequests}
            renderItem={renderServiceRequestItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.inviteButton, (!selectedServiceId || loading) && styles.inviteButtonDisabled]}
            onPress={handleInviteWorker}
            disabled={!selectedServiceId || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.inviteButtonText}>Send Invitation</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  placeholder: {
    width: 32,
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  workerAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  workerGenre: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 2,
  },
  workerLocation: {
    fontSize: 12,
    color: "#8E8E93",
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  serviceRequestItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceRequestItemSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  serviceRequestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceRequestInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceRequestCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginRight: 8,
  },
  serviceRequestStatus: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceRequestStatusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E40AF",
  },
  serviceRequestBudget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  serviceRequestDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 8,
  },
  serviceRequestDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceRequestUrgency: {
    fontSize: 12,
    color: "#8E8E93",
  },
  serviceRequestUrgencyValue: {
    fontWeight: "600",
    color: "#1D1D1F",
  },
  serviceRequestDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  serviceRequestLocation: {
    marginBottom: 8,
  },
  serviceRequestLocationText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  selectedIndicator: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  selectedIndicatorText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },
  inviteButton: {
    flex: 2,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteButtonDisabled: {
    backgroundColor: "#8E8E93",
  },
  inviteButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
})

export default InviteWorkerModal
