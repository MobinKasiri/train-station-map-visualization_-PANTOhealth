import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchStations, filterStationsByCity } from "@/api/stationsApi";
import { Station } from "@/types";

// Mock station data for testing
const mockStations: Station[] = [
   {
      id: 1,
      name: "Berlin Hbf",
      city: "Berlin",
      lat: 52.5251,
      lng: 13.3694,
   },
   { id: 2, name: "München Hauptbahnhof", city: "München", lat: 48.14, lng: 11.558 },
   { id: 3, name: "Hamburg Hauptbahnhof", city: "Hamburg", lat: 53.55, lng: 10.006 },
   { id: 4, name: "Berlin Ostbahnhof", city: "Berlin", lat: 52.51, lng: 13.434 },
   { id: 5, name: "Frankfurt Hauptbahnhof", city: "Frankfurt", lat: 50.107, lng: 8.663 },
];

describe("filterStationsByCity", () => {
   it("should return all stations when filter is empty", () => {
      const result = filterStationsByCity(mockStations, "");
      expect(result).toHaveLength(mockStations.length);
      expect(result).toEqual(mockStations);
   });

   it("should return all stations when filter is whitespace only", () => {
      const result = filterStationsByCity(mockStations, "   ");
      expect(result).toHaveLength(mockStations.length);
   });

   it("should filter stations by exact city name", () => {
      const result = filterStationsByCity(mockStations, "Berlin");
      expect(result).toHaveLength(2);
      expect(result.every((s) => s.city === "Berlin")).toBe(true);
   });

   it("should filter case-insensitively", () => {
      const result = filterStationsByCity(mockStations, "MÜNCHEN");
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe("München");
   });

   it("should filter by partial match", () => {
      const result = filterStationsByCity(mockStations, "Ham");
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe("Hamburg");
   });

   it("should return empty array when no stations match", () => {
      const result = filterStationsByCity(mockStations, "NonExistentCity");
      expect(result).toHaveLength(0);
   });

   it("should handle special characters in filter", () => {
      const result = filterStationsByCity(mockStations, "Münch");
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe("München");
   });

   it("should trim whitespace from filter", () => {
      const result = filterStationsByCity(mockStations, "  Berlin  ");
      expect(result).toHaveLength(2);
   });
});

describe("fetchStations", () => {
   beforeEach(() => {
      vi.resetAllMocks();
   });

   it("should fetch and normalize stations from API", async () => {
      const mockApiResponse = [
         {
            id: 1,
            name: "Test Station",
            city: "Test City",
            lat: 52.0,
            lng: 13.0,
         },
      ];

      (globalThis.fetch as any) = vi.fn().mockResolvedValueOnce({
         ok: true,
         json: async () => mockApiResponse,
      });

      const result = await fetchStations();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
         id: 1,
         name: "Test Station",
         city: "Test City",
         lat: 52.0,
         lng: 13.0,
      });
   });

   it("should throw error when API returns non-OK response", async () => {
      (globalThis.fetch as any) = vi.fn().mockResolvedValueOnce({
         ok: false,
         status: 500,
      });

      await expect(fetchStations()).rejects.toThrow("Failed to fetch stations: 500");
   });

   it("should throw error when API returns non-array data", async () => {
      (globalThis.fetch as any) = vi.fn().mockResolvedValueOnce({
         ok: true,
         json: async () => ({ notAnArray: true }),
      });

      await expect(fetchStations()).rejects.toThrow("Invalid data format: expected array");
   });

   it("should handle missing fields gracefully", async () => {
      const mockApiResponse = [{ id: 1 }];

      (globalThis.fetch as any) = vi.fn().mockResolvedValueOnce({
         ok: true,
         json: async () => mockApiResponse,
      });

      const result = await fetchStations();

      expect(result[0]).toEqual({
         id: 1,
         name: "Unknown Station",
         city: "Unknown City",
         lat: 0,
         lng: 0,
      });
   });
});
