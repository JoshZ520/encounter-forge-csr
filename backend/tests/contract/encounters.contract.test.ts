import fs from "node:fs";
import path from "node:path";

describe("Encounters contract", () => {
  const openApiPath = path.resolve(process.cwd(), "../specs/001-encounter-crud-auth/contracts/openapi.yaml");

  it("defines encounter CRUD paths", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain("/encounters:");
    expect(contractText).toContain("/encounters/{encounterId}:");
  });

  it("defines expected encounter status codes", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain('"201":');
    expect(contractText).toContain('"200":');
    expect(contractText).toContain('"204":');
    expect(contractText).toContain('"400":');
    expect(contractText).toContain('"401":');
    expect(contractText).toContain('"404":');
  });
});
