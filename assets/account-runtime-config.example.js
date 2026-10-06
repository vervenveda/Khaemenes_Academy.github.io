// Public, non-secret runtime configuration example.
// Enable only after the protected Account Service is commissioned.
// Never place credentials, session secrets, tokens, password hashes, peppers,
// private keys, or anti-abuse thresholds in this file.
window.KHAEMENES_ACCOUNT_RUNTIME = Object.freeze({
  enabled: false,
  baseUrl: "https://accounts.example.invalid/v1/account",
  timeoutMs: 8000
});
