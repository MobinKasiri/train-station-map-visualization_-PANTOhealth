# PANTOhealth - German Train Stations Visualization

A React + TypeScript application that visualizes train stations in Germany on an interactive Leaflet map with city filtering and list-map synchronization.

## 🚀 Project Overview

This application provides an interactive way to explore train stations across Germany:

-  View all stations on an interactive Leaflet map
-  Filter stations by city name (case-insensitive, partial match)
-  Click stations in the list to zoom and highlight on the map
-  Real-time updates as filters are applied
-  Clean, minimal UI with smooth animations

## 🛠 Tech Stack

| Technology                | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| **React 18**              | UI library with functional components and hooks |
| **TypeScript**            | Type safety throughout the application          |
| **Vite**                  | Fast build tool and dev server                  |
| **Leaflet.js**            | Interactive maps                                |
| **Material UI (MUI)**     | UI component library                            |
| **Context + useReducer**  | State management                                |
| **Vitest**                | Testing framework                               |
| **React Testing Library** | Component testing                               |

## 📁 Project Structure

```
src/
├── api/
│   └── stationsApi.ts          # API layer - fetch & filter logic
├── components/
│   ├── common/
│   │   ├── LoadingState.tsx    # Loading spinner component
│   │   ├── ErrorState.tsx      # Error display with retry
│   │   └── EmptyState.tsx      # Empty results message
│   ├── Map/
│   │   └── StationsMap.tsx     # Leaflet map component
│   └── Sidebar/
│       ├── Sidebar.tsx         # Sidebar container
│       ├── CityFilter.tsx      # Search input component
│       ├── StationsList.tsx    # List container
│       └── StationItem.tsx     # Individual station item
├── context/
│   └── StationsContext.tsx     # State management provider
├── hooks/
│   └── useStations.ts          # Custom hook for context access
├── types/
│   └── index.ts                # TypeScript type definitions
├── __tests__/
│   ├── stationsApi.test.ts     # API & filter logic tests
│   └── StationsList.test.tsx   # Component tests
├── test/
│   └── setup.ts                # Test configuration
├── App.tsx                     # Root component with providers
└── main.tsx                    # Application entry point
```

## 🏗 Architecture Decisions

### State Management: Context + useReducer

**Why this approach?**

1. **Right-sized solution**: For an application with a single data source (stations) and straightforward state transitions, Context + useReducer provides sufficient capability without external dependencies.

2. **Native React**: No additional bundle size from state management libraries (Redux, Zustand).

3. **Predictable updates**: The reducer pattern ensures all state changes flow through a single function, making debugging straightforward.

4. **Performance optimized**:
   -  `useMemo` for context values prevents unnecessary re-renders
   -  `React.memo` for list items avoids re-rendering unchanged items
   -  `useCallback` for event handlers maintains referential equality

**Trade-offs considered**:

-  **Zustand**: Would offer simpler boilerplate but adds a dependency. Better for larger apps with multiple stores.
-  **Redux**: Overkill for this scope. Would add significant boilerplate.
-  **Local state + prop drilling**: Would reduce maintainability as the app grows.

### API Layer Separation

The `stationsApi.ts` module encapsulates all data fetching logic:

-  Single responsibility: only handles API communication
-  Data normalization happens here, not in components
-  Easy to mock for testing
-  Could easily be extended for caching or additional endpoints

### Component Design Principles

-  **Single Responsibility**: Each component does one thing well
-  **Memoization**: `StationItem` uses `React.memo` to prevent re-renders
-  **Reusability**: Common components (LoadingState, ErrorState, EmptyState) are generic
-  **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+
-  npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pantohealth-train-stations

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite includes:

#### API & Logic Tests (`stationsApi.test.ts`)

-  Filter returns all stations when filter is empty
-  Filter handles whitespace-only input
-  Filter by exact city name
-  Case-insensitive filtering
-  Partial match filtering
-  Empty results handling
-  Special character handling
-  API response normalization
-  Error handling for failed requests
-  Graceful handling of missing data fields

#### Component Tests (`StationsList.test.tsx`)

-  Loading state rendering
-  Error state rendering with retry button
-  Empty state when filter yields no results
-  Station list rendering
-  Station selection on click
-  Selected station highlighting

### Sample Test Output

```
 ✓ src/__tests__/stationsApi.test.ts (12 tests)
 ✓ src/__tests__/StationsList.test.tsx (7 tests)

 Test Files  2 passed
 Tests       19 passed
```

## 📡 API Data Source

Station data is fetched from:

```
https://gist.githubusercontent.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c/raw
```

### Data Shape

```typescript
interface Station {
   id: string;
   name: string;
   city: string;
   latitude: number;
   longitude: number;
}
```

## ✨ Features

### Functional

-  [x] Fetch station data from API on app load
-  [x] Display stations on Leaflet map with markers
-  [x] Station list with name and city
-  [x] City filter (case-insensitive, partial match)
-  [x] List click → map zoom + marker highlight
-  [x] Map marker click → station selection
-  [x] Clear filter restores all stations

### UX

-  [x] Loading state with spinner
-  [x] Error state with retry button
-  [x] Empty state for no filter results
-  [x] Smooth map animations (flyTo)
-  [x] Hover effects on list items
-  [x] Keyboard navigation support
-  [x] Responsive design ready

### Code Quality

-  [x] Clean folder structure
-  [x] Separated API, state, and UI layers
-  [x] Strong TypeScript typing
-  [x] Memoized components and callbacks
-  [x] Meaningful test coverage
-  [x] Accessibility (ARIA labels, semantic HTML)

## 🔧 Configuration

### Map Settings (in `StationsMap.tsx`)

```typescript
const GERMANY_CENTER = [51.1657, 10.4515]; // Default map center
const DEFAULT_ZOOM = 6; // Initial zoom level
const SELECTED_ZOOM = 12; // Zoom when station selected
```

### Theme (in `App.tsx`)

The MUI theme is customized for a clean, minimal look:

-  Primary color: `#1976d2`
-  Clean typography with Inter font
-  Rounded buttons and inputs

## 📋 Scripts

| Script                  | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Build for production     |
| `npm run preview`       | Preview production build |
| `npm test`              | Run tests                |
| `npm run test:ui`       | Run tests with UI        |
| `npm run test:coverage` | Run tests with coverage  |
| `npm run lint`          | Lint source files        |
| `npm run type-check`    | TypeScript type checking |

---

**Built for PANTOhealth Frontend Assignment**
