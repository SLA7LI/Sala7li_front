# Sala7li Front

Sala7li is a mobile application designed to connect users with the most skilled workers in Algiers. Users can easily find, request, and manage services such as plumbing, electrical work, and more. Service providers can browse nearby opportunities, bid for jobs, and manage their workflow efficiently through an intuitive interface.

---

## 🚀 Project Overview

Sala7li simplifies the process of finding reliable service professionals and streamlines communication between customers and workers. Key features include:

- **Browse & Search**: Find skilled professionals (electricians, plumbers, painters, etc.) with detailed profiles and ratings.
- **Request Services**: Post service requests and receive bids from multiple providers.
- **Service Map**: View active requests and their locations on an interactive map.
- **Job Management**: Track status (Pending, Bidding, Accepted, Completed) and participate in job-specific chat lobbies.
- **Quick Stats**: Dashboard with your requests, jobs, and completion status.



![Alt text](/IMG_4596.png)
---

## 🗂 Project Structure

A typical structure for Sala7li Front might look like:

```
Sala7li_front/
├── assets/              # Images, icons, fonts
├── components/          # Reusable UI components
├── navigation/          # App navigation logic
├── screens/             # Main UI screens (Home, Explore, Profile, etc.)
├── services/            # API services and helpers
├── utils/               # Utility functions
├── App.js               # Main entry point
├── package.json         # NPM dependencies
└── ...
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- React Native CLI
- Android Studio or Xcode (for device/simulator)

### Installation

```bash
git clone https://github.com/SLA7LI/Sala7li_front.git
cd Sala7li_front
npm install
# or
yarn install
```

### Running the App

```bash
# For Android
npx react-native run-android

# For iOS
npx react-native run-ios
```

> **Note:**  
> The API base URL is configurable and may need to be changed depending on your backend deployment.  
> Please check the relevant configuration file (e.g., `.env`, or inside `services/api.js`) and update the API endpoint as needed before running the app.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with your ideas, fixes, or improvements.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

---

## 📬 Contact

For support or questions, please contact the repository owner or open an issue in this repository.
