import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "./Home.jsx";

describe("página Home", () => {
  it("muestra el saludo cuando la página carga", async () => {
    render(<Home />);

    expect(await screen.findByText("¡Hola desde React!")).toBeDefined();
  });
});
