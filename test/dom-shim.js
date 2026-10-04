// Minimal, dependency-free DOM shim used to run the plugin in Node's test runner.
// It only implements what easy-number-separator.js needs.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function createDom() {
  const observers = [];

  function notify(target, node) {
    observers.forEach((o) => {
      if (target === o.root || o.root.contains(target)) {
        o.queue.push({ type: "childList", target, addedNodes: [node] });
        if (!o.scheduled) {
          o.scheduled = true;
          queueMicrotask(() => {
            o.scheduled = false;
            const records = o.queue.splice(0);
            if (records.length) o.cb(records, o);
          });
        }
      }
    });
  }

  function matchesSimple(el, sel) {
    const m = sel.trim().match(/^([a-zA-Z]*)((?:[#.][\w-]+)*)$/);
    if (!m) throw new Error("Unsupported selector in shim: " + sel);
    if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
    const parts = m[2].match(/[#.][\w-]+/g) || [];
    return parts.every((p) =>
      p[0] === "#" ? el.getAttribute("id") === p.slice(1) : el.classList.contains(p.slice(1))
    );
  }

  class Element {
    constructor(tag) {
      this.nodeType = 1;
      this.tagName = tag.toUpperCase();
      this.attrs = {};
      this.childNodes = [];
      this.parentNode = null;
      this.listeners = {};
      this.value = "";
      const self = this;
      this.classList = {
        contains: (c) => (self.attrs["class"] || "").split(/\s+/).includes(c),
      };
    }
    getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; }
    setAttribute(n, v) { this.attrs[n] = String(v); }
    removeAttribute(n) { delete this.attrs[n]; }
    get name() { return this.getAttribute("name") || ""; }
    set name(v) { this.setAttribute("name", v); }
    get type() { return this.getAttribute("type") || "text"; }
    set type(v) { this.setAttribute("type", v); }
    get id() { return this.getAttribute("id") || ""; }
    get nextSibling() {
      if (!this.parentNode) return null;
      const s = this.parentNode.childNodes;
      return s[s.indexOf(this) + 1] || null;
    }
    contains(n) {
      for (let p = n; p; p = p.parentNode) if (p === this) return true;
      return false;
    }
    matches(sel) { return sel.split(",").some((s) => matchesSimple(this, s)); }
    descendants() {
      const out = [];
      (function walk(n) { n.childNodes.forEach((c) => { out.push(c); walk(c); }); })(this);
      return out;
    }
    querySelectorAll(sel) { return this.descendants().filter((e) => e.matches(sel)); }
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
    insertBefore(child, ref) {
      if (child.parentNode) child.parentNode.childNodes.splice(child.parentNode.childNodes.indexOf(child), 1);
      const i = ref ? this.childNodes.indexOf(ref) : -1;
      if (i < 0) this.childNodes.push(child); else this.childNodes.splice(i, 0, child);
      child.parentNode = this;
      notify(this, child);
      return child;
    }
    appendChild(child) { return this.insertBefore(child, null); }
    addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn); }
    dispatchEvent(ev) {
      ev.target = this;
      ev.defaultPrevented = false;
      ev.preventDefault = () => { ev.defaultPrevented = true; };
      (this.listeners[ev.type] || []).forEach((fn) => fn.call(this, ev));
      return !ev.defaultPrevented;
    }
  }

  const documentElement = new Element("html");
  const body = new Element("body");
  documentElement.appendChild(body);

  const document = {
    documentElement,
    body,
    createElement: (tag) => new Element(tag),
    querySelectorAll: (sel) => [documentElement].concat(documentElement.descendants()).filter((e) => e.matches(sel)),
    querySelector: (sel) => document.querySelectorAll(sel)[0] || null,
    getElementById: (id) => document.querySelector("#" + id),
    addEventListener: () => {},
  };

  class MutationObserver {
    constructor(cb) { this.cb = cb; }
    observe(root) {
      observers.push({ cb: this.cb, root, queue: [], scheduled: false });
    }
    disconnect() {
      for (let i = observers.length - 1; i >= 0; i--) if (observers[i].cb === this.cb) observers.splice(i, 1);
    }
  }

  return { document, MutationObserver, Element };
}

// Build an <input> from an attribute map and append it to <body>.
function addInput(document, attrs) {
  const el = document.createElement("input");
  Object.keys(attrs || {}).forEach((k) => {
    if (k === "value") el.value = attrs[k];
    else el.setAttribute(k, attrs[k]);
  });
  document.body.appendChild(el);
  return el;
}

// Simulate typing at the end of the input, one character at a time.
function type(el, text) {
  for (const ch of text) {
    el.value += ch;
    el.dispatchEvent({ type: "input", data: ch });
  }
}

// Simulate pasting (or dropping) text at the end of the input. Returns false if the
// paste/drop event was cancelled, in which case the value is left untouched.
function paste(el, text, kind) {
  kind = kind || "paste";
  const allowed = el.dispatchEvent({ type: kind });
  if (!allowed) return false;
  el.value += text;
  el.dispatchEvent({ type: "input", inputType: kind === "drop" ? "insertFromDrop" : "insertFromPaste", data: text });
  return true;
}

// Load the plugin into a fresh sandbox with its own DOM.
function load() {
  const dom = createDom();
  const context = vm.createContext({
    document: dom.document,
    window: {},
    MutationObserver: dom.MutationObserver,
    queueMicrotask,
    console,
  });
  context.window = context;
  const src = fs.readFileSync(path.join(__dirname, "..", "easy-number-separator.js"), "utf8");
  vm.runInContext(src, context, { filename: "easy-number-separator.js" });
  return { context, document: dom.document, easyNumberSeparator: context.easyNumberSeparator };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

module.exports = { load, addInput, type, paste, tick };
