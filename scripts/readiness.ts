// Usage: npm run readiness  (reads env vars from the current shell)
import { site } from "../src/config/site.ts";
import { checkReadiness } from "../src/lib/readiness.ts";

const r = checkReadiness(site, process.env);
console.log(`Production readiness for "${site.name}" (productionMode=${site.productionMode})\n`);
for (const i of r.items) console.log(`${i.ok ? "PASS" : "TODO"}  ${i.label}`);
console.log(r.ready ? "\nAll checks pass. The owner may now set productionMode: true." : "\nNot ready: keep productionMode false.");
process.exit(r.ready ? 0 : 1);
