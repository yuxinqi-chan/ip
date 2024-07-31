import { Hono } from "hono";
import { detectIPVersion, getIpInfo } from "./utils";

const app = new Hono();

app.get("/", (c) => {
  const ipInfo = getIpInfo(c.req.header("CF-Connecting-IP"), c.req.raw.cf);
  return c.json(ipInfo);
});
export default app;
