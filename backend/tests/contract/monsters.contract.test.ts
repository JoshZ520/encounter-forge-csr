import fs from "node:fs";
import path from "node:path";

describe("Monsters contract", () => {
  const openApiPath = path.resolve(process.cwd(), "../specs/001-encounter-crud-auth/contracts/openapi.yaml");

  it("defines the monsters lookup path", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain("/monsters:");
  });

  it("defines the expected monsters status codes", () => {
    const contractText = fs.readFileSync(openApiPath, "utf8");

    expect(contractText).toContain('"200":');
    expect(contractText).toContain('"401":');
  });
});
