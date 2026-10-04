function easyNumberSeparator(config) {
  config = config || {};

  const obj = {
    selector: config.selector || ".number-separator",
    separator: config.separator || ",",
    decimalSeparator: config.decimalSeparator || ".",
    resultInput: config.resultInput,
    maxDecimals: config.maxDecimals,
    submitRaw: !!config.submitRaw,
    disallowPaste: !!config.disallowPaste,
    disallowDrop: !!config.disallowDrop
  }

  // Elements already handled by this instance, so listeners are never attached twice
  const boundFields = new WeakSet();
  // Hidden inputs created by the submitRaw option, keyed by their visible field (#7)
  const rawInputs = new WeakMap();
  const rawInputSet = new WeakSet();

  // Escape a string so it is matched literally inside a regular expression
  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\\-\/]/g, "\\$&");
  }

  const sep = escapeRegExp(obj.separator);
  const dec = escapeRegExp(obj.decimalSeparator);
  const allowedInput = new RegExp(
    `^-?\\d*[${sep}${dec}]?(\\d{0,3}${sep})*(\\d{3}${sep})?\\d{0,3}$`
  );

  // Returns the formatted value and the raw value (no separators, "." as decimal point)
  function parseNumber(value) {
    const num = String(value).split(obj.separator).join("");
    const parts = num.split(obj.decimalSeparator);
    const integer = parts[0];
    let decimals = parts.length > 1 ? parts[1] : null;

    // Limit the number of decimal places (#9)
    if (decimals !== null && typeof obj.maxDecimals === "number" && obj.maxDecimals >= 0) {
      decimals = obj.maxDecimals === 0 ? null : decimals.slice(0, obj.maxDecimals);
    }

    const rgx = /(\d+)(\d{3})/;
    let formatted = integer;
    while (rgx.test(formatted)) {
      formatted = formatted.replace(rgx, function (match, head, tail) {
        return head + obj.separator + tail;
      });
    }

    return {
      formatted: formatted + (decimals !== null ? obj.decimalSeparator + decimals : ""),
      raw: integer + (decimals !== null ? "." + decimals : "")
    };
  }

  function formatField(el) {
    const result = parseNumber(el.value);
    el.value = result.formatted;

    if (obj.resultInput) {
      const resInput = document.querySelector(obj.resultInput);

      if (resInput) {
        resInput.value = result.raw;
      }
    }

    const rawInput = rawInputs.get(el);
    if (rawInput) {
      rawInput.value = result.raw;
    }
  }

  // submitRaw: move the field's name to a hidden input that holds the raw value (#7)
  function createRawInput(el) {
    const name = el.getAttribute("name");
    if (!name || !el.parentNode) return;

    const rawInput = document.createElement("input");
    rawInput.type = "hidden";
    rawInput.name = name;
    rawInputSet.add(rawInput);

    el.removeAttribute("name");
    el.setAttribute("data-name", name);
    el.parentNode.insertBefore(rawInput, el.nextSibling);
    rawInputs.set(el, rawInput);
  }

  // Keep only digits, separators and a leading minus sign (used for pasted/dropped text)
  const disallowedChars = new RegExp(`[^\\d${sep}${dec}-]`, "g");
  function sanitize(value) {
    const cleaned = String(value).replace(disallowedChars, "");
    return (cleaned.charAt(0) === "-" ? "-" : "") + cleaned.replace(/-/g, "");
  }

  function preventEvent(e) {
    e.preventDefault();
  }

  function onInput(e) {
    const el = e.target;

    // Pasted or dropped text: strip invalid characters, then reformat the whole value
    if (e.inputType === "insertFromPaste" || e.inputType === "insertFromDrop") {
      el.value = sanitize(el.value);
      formatField(el);
      return;
    }

    const key = e.data || el.value.substr(-1);

    if (allowedInput.test(key)) {
      formatField(el);
    } else {
      el.value = el.value.substring(0, el.value.length - 1);
      e.preventDefault();
      return false;
    }
  }

  function bindField(el) {
    if (boundFields.has(el) || rawInputSet.has(el)) return;
    boundFields.add(el);

    if (obj.submitRaw) {
      createRawInput(el);
    }

    if (obj.disallowPaste) {
      el.addEventListener("paste", preventEvent);
    }
    if (obj.disallowDrop) {
      el.addEventListener("drop", preventEvent);
    }

    el.addEventListener("input", onInput);
    formatField(el);
  }

  // Bind every matching field inside root (and root itself if it matches)
  function listenFields(root) {
    if (root.matches && root.matches(obj.selector)) {
      bindField(root);
    }
    if (root.querySelectorAll) {
      root.querySelectorAll(obj.selector).forEach(bindField);
    }
  }

  listenFields(document);

  // Fire separator when matching elements are appended to the page (#6).
  // MutationObserver replaces the deprecated (and now removed) DOMNodeInserted event.
  if (typeof MutationObserver !== "undefined" && document.documentElement) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) listenFields(node);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  return {
    // Re-format all matching fields, e.g. after setting their value from code (#13)
    refresh: function () {
      document.querySelectorAll(obj.selector).forEach(function (el) {
        if (rawInputSet.has(el)) {
          return;
        } else if (boundFields.has(el)) {
          formatField(el);
        } else {
          bindField(el);
        }
      });
    }
  };
}
