"use client"

import { useState } from "react"
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
          </View>

          <Text style={styles.title}>Successfully Joined!</Text>
          <Text style={styles.message}>
            You have successfully joined the bidding for this {serviceRequest?.category || "service"} request.
          </Text>

          <View style={styles.serviceInfo}>
            <Text style={styles.serviceCategory}>{serviceRequest?.category}</Text>
            <Text style={styles.serviceBudget}>{serviceRequest?.budget} DA</Text>
          </View>

          <Text style={styles.nextSteps}>
            You will be notified when the client reviews your application and other bids.
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleSuccess} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
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

export default JoinBiddingModal
