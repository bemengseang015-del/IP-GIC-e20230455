import { JSDOM } from "jsdom";

const dom = new JSDOM("", {
  url: "http://localhost/",
});

Object.defineProperty(globalThis, "localStorage", {
  value: dom.window.localStorage,
  configurable: true,
});

