// @vitest-environment jsdom
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { EncounterListPage } from "../../src/pages/EncounterListPage";

const fetchEncountersMock = vi.fn();
const deleteEncounterMock = vi.fn();

vi.mock("../../src/stores/authStore", () => ({
  useAuthStore: (selector: any) => selector({ logout: vi.fn() }),
}));

vi.mock("../../src/features/encounters/encounterApi", () => ({
  fetchEncounters: (...args: unknown[]) => fetchEncountersMock(...args),
  deleteEncounter: (...args: unknown[]) => deleteEncounterMock(...args),
}));

describe("CRUD feedback timing", () => {
  it("shows delete confirmation feedback quickly", async () => {
    fetchEncountersMock.mockResolvedValueOnce({
      items: [
        {
          id: "enc-1",
          title: "Latency Test Encounter",
          partySize: 4,
          partyLevel: 5,
          environment: "Dungeon",
          difficulty: "Medium",
          targetCR: "5",
          status: "draft",
          updatedAt: new Date().toISOString(),
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
    });
    fetchEncountersMock.mockResolvedValueOnce({
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
    });
    deleteEncounterMock.mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    const startedAt = performance.now();
    render(
      <MemoryRouter>
        <EncounterListPage />
      </MemoryRouter>
    );

    await screen.findByText("Latency Test Encounter");

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(Boolean(screen.getByText(/Deleted "Latency Test Encounter"\./))).toBe(true));

    const elapsedMs = performance.now() - startedAt;
    expect(elapsedMs).toBeLessThan(2000);
  });
});