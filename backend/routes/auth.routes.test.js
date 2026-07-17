const request = require("supertest");
const app = require("../app");

describe("Validate Routes", () => {
  test("Routes working fine", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "juan@.com", pass: "123456" });
    expect(res.status).toBe(400);
  });
  test("Register Working", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nombre: "enzo",
      apellido: "enzo",
      email: "enzo@enzo",
      telefono: "2929299",
      password: "123456",
      confirmPassword: "123456",
      es_anfitrion: false,
    });
    expect(res.status).toBe(400);
  });
  const db = require("../models/db");
  afterAll(() => db.end());
});
