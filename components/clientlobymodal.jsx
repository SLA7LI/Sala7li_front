"use client"

import { useEffect, useState } from "react"
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import loby from "../api/loby"


const { width, height } = Dimensions.get("window")

const LobbyModal = ({ visible, onClose, serviceRequest, workerRequest }) => {
  const [loading, setLoading] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [currentBid, setCurrentBid] = useState(null)
  const [slideAnim] = useState(new Animated.Value(height))
  const [fadeAnim] = useState(new Animated.Value(0))
  const [activeTab, setActiveTab] = useState("chat") // 'chat' or 'workers'
  const [participants, setParticipants] = useState([])

  // Messages statiques pour la démo
  const staticMessages = [
    {
      id: 1,
      sender: "client",
      message: "Hello! I'm interested in your services for this project.",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: "text",
    },
    {
      id: 2,
      sender: "worker",
      message: "Hi! I'd be happy to help. I've reviewed your requirements.",
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      type: "text",
    },
    {
      id: 3,
      sender: "client",
      message: "What would be your best price for this work?",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      type: "text",
    },
    {
      id: 4,
      sender: "worker",
      message: "Based on the scope, I can offer a competitive rate. Let me place a bid.",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      type: "text",
    },
  ]

  useEffect(() => {
    if (visible) {
      setMessages([...staticMessages])
      setCurrentBid(serviceRequest?.budget ? serviceRequest.budget * 0.9 : 5000)
      
      // Set participants from service request
      if (serviceRequest?.participants) {
        setParticipants(serviceRequest.participants)
      }

      // Animation d'entrée
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Reset animations
      slideAnim.setValue(height)
      fadeAnim.setValue(0)
    }
  }, [visible, serviceRequest])

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose()
    })
  }

  const handleLeaveLobby = async () => {
    Alert.alert("Leave Lobby", "Are you sure you want to leave this negotiation? You won't be able to rejoin.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)
            await loby.leaveBidding(serviceRequest?.id || workerRequest?.serviceRequest?.id)

            Alert.alert("Success", "You have left the lobby successfully.", [{ text: "OK", onPress: handleClose }])
          } catch (error) {
            console.error("Error leaving lobby:", error)
            Alert.alert("Error", error.response?.data?.message || "Failed to leave lobby")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const handlePlaceBid = async () => {
    const bidValue = bidAmount.trim()
    if (!bidValue || isNaN(bidValue) || Number.parseFloat(bidValue) <= 0) {
      Alert.alert("Invalid Bid", "Please enter a valid bid amount")
      return
    }

    try {
      setLoading(true)
      await loby.placeBid(serviceRequest?.id || workerRequest?.serviceRequest?.id, Number.parseFloat(bidValue))

      // Ajouter le message de bid aux messages
      const bidMessage = {
        id: Date.now(), // Use timestamp for unique ID
        sender: "worker",
        message: `I'm placing a bid of ${bidValue} DA for this project.`,
        timestamp: new Date(),
        type: "bid",
        amount: Number.parseFloat(bidValue),
      }

      setMessages((prevMessages) => [...prevMessages, bidMessage])
      setCurrentBid(Number.parseFloat(bidValue))
      setBidAmount("")

      Alert.alert("Success", "Your bid has been placed successfully!")
    } catch (error) {
      console.error("Error placing bid:", error)
      Alert.alert("Error", error.response?.data?.message || "Failed to place bid")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    const messageText = newMessage.trim()
    if (!messageText) return

    const message = {
      id: Date.now(), // Use timestamp for unique ID
      sender: "worker",
      message: messageText,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prevMessages) => [...prevMessages, message])
    setNewMessage("")

    // Simuler une réponse du client après 2 secondes
    setTimeout(() => {
      const clientResponse = {
        id: Date.now() + 1,
        sender: "client",
        message: "Thanks for your message! I'll consider your proposal.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prevMessages) => [...prevMessages, clientResponse])
    }, 2000)
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessage = (message) => {
    const isWorker = message.sender === "worker"

    return (
      <View key={message.id} style={[styles.messageContainer, isWorker ? styles.workerMessage : styles.clientMessage]}>
        <View
          style={[
            styles.messageBubble,
            isWorker ? styles.workerBubble : styles.clientBubble,
            message.type === "bid" && styles.bidBubble,
          ]}
        >
          {message.type === "bid" && (
            <View style={styles.bidHeader}>
              <Text style={styles.bidIcon}>💰</Text>
              <Text style={styles.bidLabel}>Bid Placed</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isWorker ? styles.workerText : styles.clientText,
              message.type === "bid" && styles.bidText,
            ]}
          >
            {message.message}
          </Text>
          {message.type === "bid" && (
            <View style={styles.bidAmount}>
              <Text style={styles.bidAmountText}>{message.amount} DA</Text>
            </View>
          )}
        </View>
        <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
      </View>
    )
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, { color: i <= rating ? "#FFD700" : "#E0E0E0" }]}>
          ★
        </Text>,
      )
    }
    return stars
  }

  const renderWorkerCard = (participant) => {
    const worker = participant.worker
    const user = worker?.user
    
    return (
      <View key={participant.workerId} style={styles.participantCard}>
        <View style={styles.participantHeader}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              {worker?.picture ? (
                <Image source={{ uri: worker.picture }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{user?.name}</Text>
              <Text style={styles.workerLocation}>
                {user?.wilaya}, {user?.baladia}
              </Text>
              <View style={styles.ratingContainer}>{renderStars(worker?.rating || 0)}</View>
            </View>
          </View>
          {worker?.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.participantDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[
              styles.detailValue,
              participant.status === 'accepted' && styles.statusAccepted,
              participant.status === 'pending' && styles.statusPending,
              participant.status === 'bidding' && styles.statusBidding
            ]}>
              {participant.status}
            </Text>
          </View>
          
          {participant.bid > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bid Amount:</Text>
              <Text style={styles.bidValue}>{participant.bid} DA</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{worker?.genre || 'General'}</Text>
          </View>
        </View>

        <View style={styles.participantActions}>
          <TouchableOpacity style={styles.acceptButton} disabled={participant.status === 'accepted'}>
            <Text style={styles.acceptButtonText}>
              {participant.status === 'accepted' ? 'Accepted' : 'Accept Offer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: 'flex-end' }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }], maxHeight: height * 0.9, flex: 1 }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.statusIndicator} />
                <View>
                  <Text style={styles.headerTitle}>Negotiation Lobby</Text>
                  <Text style={styles.headerSubtitle}>
                    {serviceRequest?.category || workerRequest?.serviceRequest?.category}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'chat' && styles.activeTab]}
                onPress={() => setActiveTab('chat')}
              >
                <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'workers' && styles.activeTab]}
                onPress={() => setActiveTab('workers')}
              >
                <View style={styles.tabBadge}>
                  <Text style={styles.tabText}>{participants.length}</Text>
                </View>
                <Text style={[styles.tabText, activeTab === 'workers' && styles.activeTabText]}>Workers</Text>
              </TouchableOpacity>
            </View>

            {/* Project Info */}
            <View style={styles.projectInfo}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>Project Details</Text>
                <View style={styles.budgetContainer}>
                  <Text style={styles.budgetLabel}>Budget</Text>
                  <Text style={styles.budgetAmount}>
                    {serviceRequest?.budget || workerRequest?.serviceRequest?.budget} DA
                  </Text>
                </View>
              </View>
              <Text style={styles.projectDescription} numberOfLines={2}>
                {serviceRequest?.description || workerRequest?.serviceRequest?.description}
              </Text>
            </View>

            {/* Content based on active tab */}
            {activeTab === 'chat' ? (
              <View style={{ flex: 1 }}>
                {/* Messages */}
                <View style={styles.messagesContainer}>
                  <Text style={styles.messagesTitle}>Discussion</Text>
                  <ScrollView
                    style={styles.messagesList}
                    contentContainerStyle={[styles.messagesContent, { flexGrow: 1, justifyContent: 'flex-end' }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {messages.map((message) => {
                      const isWorker = message.sender === "worker";
                      return (
                        <View
                          key={message.id}
                          style={[
                            styles.messageContainer,
                            isWorker ? styles.workerMessage : styles.clientMessage,
                          ]}
                        >
                          <View
                            style={[
                              styles.messageBubble,
                              isWorker ? styles.workerBubble : styles.clientBubble,
                            ]}
                          >
                            <Text
                              style={[
                                styles.messageText,
                                isWorker ? styles.workerText : styles.clientText,
                              ]}
                            >
                              {message.message}
                            </Text>
                          </View>
                          <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Message Input */}
                <View style={styles.messageInputContainer}>
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline={true}
                    maxLength={200}
                    placeholderTextColor="#8E8E93"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={handleSendMessage}
                    autoCorrect={true}
                    autoCapitalize="sentences"
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <ScrollView style={styles.participantsList}>
                {participants.length > 0 ? (
                  participants.map((participant) => {
                    const worker = participant.worker;
                    const user = worker?.user;
                    return (
                      <View key={participant.workerId} style={styles.participantCard}>
                        <View style={styles.participantHeader}>
                          <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                              {worker?.picture ? (
                                <Image source={{ uri: worker.picture }} style={styles.profileImage} />
                              ) : (
                                <View style={styles.profileImagePlaceholder}>
                                  <Text style={styles.profileImageText}>
                                    {user?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <View style={styles.workerInfo}>
                              <Text style={styles.workerName}>{user?.name}</Text>
                              <Text style={styles.workerLocation}>
                                {user?.wilaya}, {user?.baladia}
                              </Text>
                              <View style={styles.ratingContainer}>{renderStars(worker?.rating || 0)}</View>
                            </View>
                          </View>
                          {worker?.verified && (
                            <View style={styles.verifiedBadge}>
                              <Text style={styles.verifiedText}>✓</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.participantDetails}>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bid:</Text>
                            <Text style={styles.bidValue}>{participant.bid} DA</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status:</Text>
                            <Text style={[
                              styles.detailValue,
                              participant.status === 'accepted' && styles.statusAccepted,
                              participant.status === 'pending' && styles.statusPending,
                              participant.status === 'bidding' && styles.statusBidding
                            ]}>
                              {participant.status}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.participantActions}>
                          <TouchableOpacity
                            style={[
                              styles.acceptButton,
                              participant.status === 'accepted' && { backgroundColor: '#8E8E93' }
                            ]}
                            disabled={participant.status === 'accepted'}
                            onPress={() => handleAcceptWorker(participant.workerId)}
                          >
                            <Text style={styles.acceptButtonText}>
                              {participant.status === 'accepted' ? 'Accepted' : 'Accept Offer'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  })
                ) : (
                  <View style={styles.noParticipants}>
                    <Text style={styles.noParticipantsText}>No workers have joined yet</Text>
                    <Text style={styles.noParticipantsSubtext}>Invite workers to participate in this request</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingBottom: 20,
    width: '100%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabBadge: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  projectInfo: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  budgetContainer: {
    alignItems: "flex-end",
  },
  budgetLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  projectDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 12,
  },
  currentBidContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
  },
  currentBidLabel: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  currentBidAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
  },
  messagesList: {
    flex: 1,
    maxHeight: 200,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 12,
  },
  workerMessage: {
    alignItems: "flex-end",
  },
  clientMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  workerBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  clientBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  bidBubble: {
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#28A745",
  },
  bidHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bidIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  bidLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  workerText: {
    color: "white",
  },
  clientText: {
    color: "#1D1D1F",
  },
  bidText: {
    color: "white",
    fontWeight: "500",
  },
  bidAmount: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    alignItems: "center",
  },
  bidAmountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  messageTime: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 4,
  },
  bidSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#F8F9FA",
  },
  bidSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
  },
  bidInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  bidInput: {
    flex: 1,
    fontSize: 16,
    color: "#1D1D1F",
  },
  currencyLabel: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  bidButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bidButtonDisabled: {
    backgroundColor: "#8E8E93",
  },
  bidButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 20,
    paddingTop: 0,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    fontSize: 14,
    color: "#1D1D1F",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#8E8E93",
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  actions: {
    paddingHorizontal: 20,
  },
  leaveButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  participantsList: {
    flex: 1,
    padding: 20,
  },
  participantCard: {
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
  participantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: "row",
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
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  workerLocation: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 14,
    marginRight: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    backgroundColor: "#34C759",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  participantDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  bidValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusAccepted: {
    color: '#34C759',
  },
  statusPending: {
    color: '#FF9500',
  },
  statusBidding: {
    color: '#007AFF',
  },
  participantActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  noParticipants: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noParticipantsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  noParticipantsSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
})

export default LobbyModal