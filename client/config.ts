// src/config.ts
const config = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  // Observe o prefixo VITE_ em vez de REACT_APP_
};

export default config;