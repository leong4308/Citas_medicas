import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import app from "../app.js";

// Las pruebas levantan la API en un puerto libre (0) y la apagan al terminar.
let server;
let baseUrl;

beforeAll(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("GET /health", () => {
  it("responde 200 con status ok", async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
  });
});

describe("GET /api/users", () => {
  it("responde 200 con el mensaje de ejemplo", async () => {
    const response = await fetch(`${baseUrl}/api/users`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "Listar usuarios" });
  });
});

describe("ruta inexistente", () => {
  it("responde 404", async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);

    expect(response.status).toBe(404);
  });
});
