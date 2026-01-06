import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StationsContext } from "@/context/StationsContext";
import { StationsList } from "@/components/Sidebar/StationsList";
import { StationsState } from "@/types";

// Helper to create mock context value
function createMockContext(overrides: Partial<StationsState> = {}) {
   const defaultState: StationsState = {
      stations: [],
      filteredStations: [],
      cityFilter: "",
      selectedStationId: null,
      isLoading: false,
      error: null,
      ...overrides,
   };

   return {
      state: defaultState,
      actions: {
         loadStations: vi.fn(),
         setFilter: vi.fn(),
         selectStation: vi.fn(),
         clearSelection: vi.fn(),
      },
   };
}

function renderWithContext(context: ReturnType<typeof createMockContext>) {
   return render(
      <StationsContext.Provider value={context}>
         <StationsList />
      </StationsContext.Provider>
   );
}

describe("StationsList", () => {
   it("should render loading state when isLoading is true", () => {
      const context = createMockContext({ isLoading: true });
      renderWithContext(context);

      expect(screen.getByText("Loading stations...")).toBeInTheDocument();
   });

   it("should render error state when there is an error", () => {
      const context = createMockContext({ error: "Network error" });
      renderWithContext(context);

      expect(screen.getByText("Failed to load stations")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
   });

   it("should call loadStations when retry button is clicked", () => {
      const context = createMockContext({ error: "Network error" });
      renderWithContext(context);

      fireEvent.click(screen.getByText("Try Again"));

      expect(context.actions.loadStations).toHaveBeenCalledTimes(1);
   });

   it("should render empty state when filter yields no results", () => {
      const context = createMockContext({
         cityFilter: "NonExistentCity",
         filteredStations: [],
      });
      renderWithContext(context);

      expect(screen.getByText("No stations found")).toBeInTheDocument();
      expect(screen.getByText('No stations match "NonExistentCity"')).toBeInTheDocument();
   });

   it("should render list of stations", () => {
      const context = createMockContext({
         filteredStations: [
            { id: 1, name: "Berlin Hbf", city: "Berlin", lat: 52.52, lng: 13.369 },
            { id: 2, name: "München Hbf", city: "München", lat: 48.14, lng: 11.558 },
         ],
      });
      renderWithContext(context);

      expect(screen.getByText("Berlin Hbf")).toBeInTheDocument();
      expect(screen.getByText("München Hbf")).toBeInTheDocument();
      expect(screen.getByText("Berlin")).toBeInTheDocument();
      expect(screen.getByText("München")).toBeInTheDocument();
   });

   it("should call selectStation when a station is clicked", () => {
      const context = createMockContext({
         filteredStations: [{ id: 1, name: "Berlin Hbf", city: "Berlin", lat: 52.52, lng: 13.369 }],
      });
      renderWithContext(context);

      fireEvent.click(screen.getByText("Berlin Hbf"));

      expect(context.actions.selectStation).toHaveBeenCalledWith(1);
   });

   it("should highlight selected station", () => {
      const context = createMockContext({
         filteredStations: [
            { id: 1, name: "Berlin Hbf", city: "Berlin", lat: 52.52, lng: 13.369 },
            { id: 2, name: "München Hbf", city: "München", lat: 48.14, lng: 11.558 },
         ],
         selectedStationId: 1,
      });
      renderWithContext(context);

      const berlinItem = screen.getByText("Berlin Hbf").closest('[role="button"]');
      expect(berlinItem).toHaveAttribute("aria-pressed", "true");
   });
});
