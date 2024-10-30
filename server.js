const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy middleware configuration
app.use(
  "/api/0x",
  createProxyMiddleware({
    target: "https://api.0x.org",
    changeOrigin: true,
    pathRewrite: {
      "^/api/0x": "",
    },
    headers: {
      "0x-api-key": "c2b77edb-78b8-4b99-aea2-e38169c137cd",
      "0x-version": "v2",
    },
  })
);

// Serve static files
app.use(express.static("dist"));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
