// Local test double for the lead destination. Usage:
//   MOCK_MODE=ok|fail|unconfirmed node scripts/mock-lead-webhook.mjs
import { createServer } from "node:http";
const mode = process.env.MOCK_MODE ?? "ok";
createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const secretOk = req.headers["x-lead-secret"] === (process.env.LEAD_WEBHOOK_SECRET ?? "test-secret");
    const rec = JSON.parse(body || "{}");
    console.log("received", rec.reference, rec.kind, "secretOk=" + secretOk);
    if (!secretOk || mode === "fail") { res.writeHead(500); return res.end("fail"); }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(mode === "unconfirmed" ? { ok: false } : { ok: true, reference: rec.reference }));
  });
}).listen(Number(process.env.PORT ?? 3200), () => console.log("mock webhook on", process.env.PORT ?? 3200, mode));
