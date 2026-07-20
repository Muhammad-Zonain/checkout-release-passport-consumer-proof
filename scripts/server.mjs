import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../site");
const routes = new Map([
  ["/", { file: "checkout.html", type: "text/html; charset=utf-8" }],
  ["/checkout.html", { file: "checkout.html", type: "text/html; charset=utf-8" }],
  ["/payment-sdk.js", { file: "payment-sdk.js", type: "text/javascript; charset=utf-8" }],
  ["/storefront.js", { file: "storefront.js", type: "text/javascript; charset=utf-8" }],
]);

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const route = routes.get(pathname);

  if (!route) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const body = await readFile(path.join(root, route.file));
    response.writeHead(200, {
      "content-type": route.type,
      "cache-control": "no-store",
      "content-security-policy": "default-src 'self'; script-src 'self'",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-frame-options": "DENY",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Proof fixture error: ${error.message}`);
  }
});

server.listen(4174, "127.0.0.1", () => {
  console.log("Consumer proof fixture: http://127.0.0.1:4174/checkout.html");
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
