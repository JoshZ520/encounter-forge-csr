import fs from "node:fs";
import path from "node:path";

describe("Auth contract", () => {
  const openApiPath = path.resolve(process.cwd(), "../specs/001-encounter-crud-auth/contracts/openapi.yaml");

  it("defines register, login, and logout paths", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain("/auth/register:");
    expect(contractText).toContain("/auth/login:");
    expect(contractText).toContain("/auth/logout:");
  });

  it("defines expected auth status codes", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain('"201":');
    expect(contractText).toContain('"200":');
    expect(contractText).toContain('"204":');
    expect(contractText).toContain('"400":');
    expect(contractText).toContain('"401":');
    expect(contractText).toContain('"409":');
  });
});
