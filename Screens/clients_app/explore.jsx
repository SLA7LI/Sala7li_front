"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import Service_client from "../../api/client_service"
import manage_worker from "../../api/worker"
import InviteWorkerModal from "../../components/invitemodal"

const { width, height } = Dimensions.get("window")


const ALGERIA_LOCATIONS = {
  Algiers: {
    center: { latitude: 36.7538, longitude: 3.0588 },
    baladias: {
      "Bab Ezzouar": { latitude: 36.7267, longitude: 3.1833 },
      "Bir Mourad Rais": { latitude: 36.7333, longitude: 3.0333 },
      "El Harrach": { latitude: 36.7167, longitude: 3.1333 },
      "Hussein Dey": { latitude: 36.7333, longitude: 3.1 },
      Kouba: { latitude: 36.7833, longitude: 3.0833 },
      "Mohamed Belouizdad": { latitude: 36.7333, longitude: 3.0667 },
      "Oued Koriche": { latitude: 36.7667, longitude: 3.0333 },
      Rouiba: { latitude: 36.7333, longitude: 3.2833 },
      "Sidi M'Hamed": { latitude: 36.75, longitude: 3.05 },
      "Alger Centre": { latitude: 36.7538, longitude: 3.0588 },
    },
  },
  Oran: {
    center: { latitude: 35.6969, longitude: -0.6331 },
    baladias: {
      "Oran Centre": { latitude: 35.6969, longitude: -0.6331 },
      "Bir El Djir": { latitude: 35.7167, longitude: -0.5833 },
      "Es Senia": { latitude: 35.65, longitude: -0.6167 },
      Arzew: { latitude: 35.85, longitude: -0.3167 },
      Bethioua: { latitude: 35.8, longitude: -0.2833 },
    },
  },
  Constantine: {
    center: { latitude: 36.365, longitude: 6.6147 },
    baladias: {
      "Constantine Centre": { latitude: 36.365, longitude: 6.6147 },
      "El Khroub": { latitude: 36.2833, longitude: 6.6833 },
      "Hamma Bouziane": { latitude: 36.4167, longitude: 6.5833 },
      "Ibn Badis": { latitude: 36.3333, longitude: 6.7 },
    },
  },
  Annaba: {
    center: { latitude: 36.9, longitude: 7.7667 },
    baladias: {
      "Annaba Centre": { latitude: 36.9, longitude: 7.7667 },
      "El Hadjar": { latitude: 36.8, longitude: 7.7333 },
      "Sidi Amar": { latitude: 36.8833, longitude: 7.8 },
    },
  },
  Blida: {
    center: { latitude: 36.47, longitude: 2.8281 },
    baladias: {
      "Blida Centre": { latitude: 36.47, longitude: 2.8281 },
      Boufarik: { latitude: 36.5833, longitude: 2.9167 },
      Larbaa: { latitude: 36.5667, longitude: 3.1667 },
    },
  },
  Setif: {
    center: { latitude: 36.1833, longitude: 5.4167 },
    baladias: {
      "Setif Centre": { latitude: 36.1833, longitude: 5.4167 },
      "El Eulma": { latitude: 36.15, longitude: 5.6833 },
      "Ain Oulmene": { latitude: 36.0333, longitude: 5.4167 },
    },
  },
  Tlemcen: {
    center: { latitude: 34.8833, longitude: -1.3167 },
    baladias: {
      "Tlemcen Centre": { latitude: 34.8833, longitude: -1.3167 },
      Mansourah: { latitude: 34.8667, longitude: -1.3333 },
      Chetouane: { latitude: 34.9167, longitude: -1.2833 },
    },
  },
}

const WorkersMapScreen = () => {
  const navigation = useNavigation()
  const [workers, setWorkers] = useState([])
  const [serviceRequests, setServiceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [mapRegion, setMapRegion] = useState({
    latitude: 36.7538, // Alger par défaut
    longitude: 3.0588,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
  })

  const categories = ["All", "Electrician", "Painter", "Plumber", "Carpenter", "Mechanic", "Cleaner"]

  useEffect(() => {
    fetchWorkers()
    fetchServiceRequests()
  }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const response = await manage_worker.getWorkerRequests()
      setWorkers(response.workers || [])
    } catch (error) {
      console.error("Error fetching workers:", error)
      Alert.alert("Error", "Failed to load workers")
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceRequests = async () => {
    try {
      const response = await Service_client.getServiceRequestsClient()
      setServiceRequests(response.data || [])
    } catch (error) {
      console.error("Error fetching service requests:", error)
    }
  }

  // Fonction pour obtenir les coordonnées d'un worker basé sur sa wilaya et baladia
  const getWorkerCoordinates = (worker) => {
    const wilaya = worker.wilaya
    const baladia = worker.baladia

    if (ALGERIA_LOCATIONS[wilaya]) {
      if (ALGERIA_LOCATIONS[wilaya].baladias[baladia]) {
        return ALGERIA_LOCATIONS[wilaya].baladias[baladia]
      }
      // Si la baladia n'est pas trouvée, utiliser le centre de la wilaya
      return ALGERIA_LOCATIONS[wilaya].center
    }

    // Coordonnées par défaut (Alger) si la wilaya n'est pas trouvée
    return { latitude: 36.7538, longitude: 3.0588 }
  }

  // Filtrer les workers
  const filteredWorkers = workers.filter((worker) => {
    const matchesCategory =
      selectedCategory === "All" || worker.worker?.genre?.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.worker?.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.wilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.baladia.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Ajouter les coordonnées aux workers filtrés
  const workersWithCoordinates = filteredWorkers.map((worker) => ({
    ...worker,
    coordinates: getWorkerCoordinates(worker),
  }))

  const handleWorkerPress = (worker) => {
    setSelectedWorker(worker)
  }

  const handleInviteWorker = (worker) => {
    const openRequests = serviceRequests.filter((request) => request.status === "open")

    if (openRequests.length === 0) {
      Alert.alert("No Open Service Requests", "You need to have open service requests to invite workers.", [
        { text: "OK" },
      ])
      return
    }

    setSelectedWorker(worker)
    setShowInviteModal(true)
  }

  const handleInviteSuccess = () => {
    console.log("Worker invited successfully!")
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

  const getMarkerColor = (genre) => {
    const colors = {
      Electrician: "#FF6B35",
      Painter: "#4ECDC4",
      Plumber: "#45B7D1",
      Carpenter: "#96CEB4",
      Mechanic: "#FFEAA7",
      Cleaner: "#DDA0DD",
    }
    return colors[genre] || "#007AFF"
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading workers map...</Text>
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
        <Text style={styles.headerTitle}>Workers Map</Text>
        <View style={styles.headerRight}>
          <Text style={styles.workerCount}>{workersWithCoordinates.length}</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search workers, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion} onRegionChangeComplete={setMapRegion}>
          {workersWithCoordinates.map((worker) => (
            <Marker
              key={worker.id}
              coordinate={worker.coordinates}
              pinColor={getMarkerColor(worker.worker?.genre)}
              onPress={() => handleWorkerPress(worker)}
            >
              <Callout style={styles.callout}>
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutHeader}>
                    <View style={styles.calloutProfileSection}>
                      {worker.worker?.picture ? (
                        <Image source={{ uri: worker.worker.picture }} style={styles.calloutProfileImage} />
                      ) : (
                        <View style={styles.calloutProfilePlaceholder}>
                          <Text style={styles.calloutProfileText}>
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.calloutWorkerInfo}>
                        <Text style={styles.calloutWorkerName}>{worker.name}</Text>
                        <Text style={styles.calloutWorkerGenre}>{worker.worker?.genre || "General"}</Text>
                        <View style={styles.calloutRatingContainer}>{renderStars(worker.worker?.rating || 0)}</View>
                      </View>
                    </View>
                    {worker.worker?.verified && (
                      <View style={styles.calloutVerifiedBadge}>
                        <Text style={styles.calloutVerifiedText}>✓</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.calloutLocation}>
                    📍 {worker.wilaya}, {worker.baladia}
                  </Text>

                  <Text style={styles.calloutBio} numberOfLines={2}>
                    {worker.worker?.bio || "No bio available"}
                  </Text>

                  <View style={styles.calloutStats}>
                    <Text style={styles.calloutStatsText}>
                      <Text style={styles.calloutStatsNumber}>{worker.worker?.completedJobs || 0}</Text> jobs completed
                    </Text>
                  </View>

                  <View style={styles.calloutActions}>
                    <TouchableOpacity
                      style={styles.calloutViewButton}
                      onPress={() => navigation.navigate("WorkerDetails", { worker })}
                    >
                      <Text style={styles.calloutViewButtonText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.calloutInviteButton} onPress={() => handleInviteWorker(worker)}>
                      <Text style={styles.calloutInviteButtonText}>Invite</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Categories</Text>
        <View style={styles.legendItems}>
          {["Electrician", "Painter", "Plumber", "Carpenter", "Mechanic", "Cleaner"].map((genre) => (
            <View key={genre} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: getMarkerColor(genre) }]} />
              <Text style={styles.legendText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Invite Worker Modal */}
      <InviteWorkerModal
        visible={showInviteModal}
        onClose={() => {
          setShowInviteModal(false)
          setSelectedWorker(null)
        }}
        worker={selectedWorker}
        serviceRequests={serviceRequests}
        onSuccess={handleInviteSuccess}
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
  workerCount: {
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
    width: 280,
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
  calloutProfileSection: {
    flexDirection: "row",
    flex: 1,
  },
  calloutProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  calloutProfilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  calloutProfileText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  calloutWorkerInfo: {
    flex: 1,
  },
  calloutWorkerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  calloutWorkerGenre: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 2,
  },
  calloutRatingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 10,
    marginRight: 1,
  },
  calloutVerifiedBadge: {
    width: 16,
    height: 16,
    backgroundColor: "#34C759",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  calloutVerifiedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  calloutLocation: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 6,
  },
  calloutBio: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
    marginBottom: 6,
  },
  calloutStats: {
    marginBottom: 8,
  },
  calloutStatsText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  calloutStatsNumber: {
    color: "#007AFF",
    fontWeight: "600",
  },
  calloutActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calloutViewButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
    alignItems: "center",
  },
  calloutViewButtonText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  calloutInviteButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  calloutInviteButtonText: {
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
    marginBottom: 6,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: "#8E8E93",
  },
})

export default WorkersMapScreen
