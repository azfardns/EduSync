# Edusync - Educational Management Platform

A modern, cross-platform mobile application for managing educational activities, attendance tracking, and coursework management. Built with React Native and Expo.

![Edusync Banner](https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1200)

## Features

### 🏠 Home Hub
- Real-time dashboard with key metrics
- Student performance analytics
- Quick access to recent coursework
- Dynamic statistics for instructors

### 👩‍🏫 Classroom Management
- QR code-based attendance tracking
- Coursework creation and management
- Real-time attendance monitoring
- Student enrollment tracking

### 📊 Analytics & Insights
- Performance trend visualization
- Attendance rate tracking
- Engagement metrics
- Time-based analytics

## Technical Stack

### Core Technologies
- React Native (Expo SDK 52.0.30)
- Expo Router 4.0.17
- Supabase for backend services
- TypeScript for type safety

### Key Dependencies
- `@react-native-async-storage/async-storage`: Local data persistence
- `@react-native-community/datetimepicker`: Date and time selection
- `expo-camera`: QR code scanning functionality
- `lucide-react-native`: Modern iconography
- `react-native-reanimated`: Smooth animations
- `react-native-safe-area-context`: Safe area handling

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Edusync
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
Edusync/
├── app/                    # Application routes
│   ├── (auth)/            # Authentication routes
│   ├── (tabs)/            # Main tab navigation
│   └── settings.tsx       # Settings screen
├── components/            # Reusable components
├── hooks/                # Custom hooks
├── types/                # TypeScript definitions
└── supabase/            # Database migrations
```

## Configuration

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL`: Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Supabase Schema
The application uses the following database tables:
- `profiles`: User profiles and roles
- `courses`: Course information
- `enrollments`: Student course enrollments
- `courseworks`: Assignment and assessment details
- `attendance`: Attendance records

## Usage

### User Roles
- **Students**: Can view courses, submit coursework, and mark attendance
- **Instructors**: Can create courses, manage coursework, and track attendance
- **Administrators**: Full system access and management capabilities

### Key Features

#### Attendance Tracking
```typescript
// QR Code Generation (Instructor)
<QRCodeDisplay
  value={attendanceData}
  size={200}
/>

// QR Code Scanning (Student)
<QRCodeScanner
  onScan={handleAttendance}
  onClose={closeScanner}
/>
```

#### Coursework Management
```typescript
// Creating New Coursework
const coursework = {
  title: "Midterm Exam",
  type: "Exam",
  start_time: new Date(),
  end_time: new Date(),
  course_id: "course-uuid"
};
await addCoursework(coursework);
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Web Deployment
1. Build the web version:
```bash
expo build:web
```

2. Deploy to your hosting service:
```bash
expo deploy
```

### Mobile Deployment
1. Build for iOS/Android:
```bash
eas build --platform ios
eas build --platform android
```

2. Submit to stores:
```bash
eas submit
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI/UX inspiration from modern educational platforms
- Built with [Expo](https://expo.dev)