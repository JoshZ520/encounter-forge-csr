// @vitest-environment jsdom
import { performance } from "node:perf_hooks";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EncounterFormWizard } from "../../src/features/encounters/EncounterFormWizard";
import { createEmptyEncounterFormValues } from "../../src/features/encounters/encounterValidation";

vi.mock("../../src/features/encounters/EncounterMonsterEditor", () => ({
  EncounterMonsterEditor: () => <div data-testid="monster-editor" />,
}));

describe("Encounter workflow timing", () => {
  it("completes the guided form within the UI timing budget", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const values = createEmptyEncounterFormValues();
    values.title = "Timing Check Encounter";
    values.monsters[0] = {
      isManual: true,
      name: "Goblin",
      quantity: 1,
      cr: "1",
      notes: "",
    };

    const startedAt = performance.now();
    render(
      <EncounterFormWizard
        initialValues={values}
        submitLabel="Save encounter"
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Save encounter" }).disabled).toBe(false));
    fireEvent.click(screen.getByRole("button", { name: "Save encounter" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    const elapsedMs = performance.now() - startedAt;
    expect(elapsedMs).toBeLessThan(2000);
  });
});