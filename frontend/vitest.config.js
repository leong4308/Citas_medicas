import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Configuración de las pruebas del frontend (Vitest).
// jsdom hace de navegador para poder renderizar componentes de React.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
