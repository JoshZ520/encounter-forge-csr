import fs from "node:fs";
import path from "node:path";

describe("OpenAPI contract baseline", () => {
  const openApiPath = path.resolve(process.cwd(), "../specs/001-encounter-crud-auth/contracts/openapi.yaml");

  it("loads the contract file", () => {
    expect(fs.existsSync(openApiPath)).toBe(true);
  });

  it("includes required top-level paths", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain("/auth/register:");
    expect(contractText).toContain("/auth/login:");
    expect(contractText).toContain("/auth/logout:");
    expect(contractText).toContain("/encounters:");
    expect(contractText).toContain("/encounters/{encounterId}:");
    expect(contractText).toContain("/monsters:");
  });
});
