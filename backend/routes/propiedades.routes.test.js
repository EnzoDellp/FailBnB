jest.mock("../models/db");
const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

describe("Validate JWT", () => {
  test("JWT working only with his real owner", async () => {
    const db = require("../models/db");
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 0 });
    });
    const token = jwt.sign({ id: 99 }, process.env.JWT_SECRET || "test_secret");
    const res = await request(app)
      .put("/api/propiedades/1")
      .send({ titulo: "Test" })
      .set("Authorization", "Bearer " + token);
    expect(res.status).toBe(403);
  });
  const db = require("../models/db");
  afterAll(() => db.end());
});
