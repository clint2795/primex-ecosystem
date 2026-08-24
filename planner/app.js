"use strict";

const EMAIL = "orders@primexbiolabs.co.uk";
const COMMERCIAL_AUTHORITY_URL = "../data/primex-product-library.json";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_PATTERN = /^\+?[0-9()\s-]{7,20}$/;

const DATA = { featured: [], beyond: [], sets: [], wider: [] };

function validateCommercialAuthority(authority) {
  const products = Array.isArray(authority?.products) ? authority.products : [];
  const active = products.filter((product) => product.activeForNewRequest === true);
  const codes = new Set(active.map((product) => product.productCode));
  if (authority?.metadata?.schemaVersion !== "primex-public-commercial-authority.v2") throw new Error("Unsupported commercial authority schema");
  if (!authority?.metadata?.authorityVersion) throw new Error("Commercial authority version missing");
  if (active.length !== 15 || codes.size !== 15) throw new Error("Commercial authority must contain 15 unique active entries");
  ["BPC40", "SET-WOLV10", "SET-GLOW70", "SET-KLOW80"].forEach((code) => {
    if (!codes.has(code)) throw new Error(`Commercial authority missing ${code}`);
  });
  return active;
}

function authorityProductForDisplay(product) {
  return {
    code: product.productCode,
    name: product.displayName,
    strength: product.strength,
    price: Number(product.publicPrice),
    accent: product.accent,
    family: product.family,
    contents: product.contentsDisplay || ""
  };
}

async function loadCommercialAuthority() {
  const response = await fetch(COMMERCIAL_AUTHORITY_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Commercial authority unavailable");
  const authority = await response.json();
  const active = validateCommercialAuthority(authority);
  Object.keys(DATA).forEach((section) => { DATA[section] = []; });
  active.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder)).forEach((product) => {
    if (!Object.prototype.hasOwnProperty.call(DATA, product.catalogSection)) throw new Error(`Unsupported catalogue section for ${product.productCode}`);
    DATA[product.catalogSection].push(authorityProductForDisplay(product));
  });
}

function showCommercialAuthorityFailure() {
  const message = "The current PrimeX product list could not be verified. Please contact PrimeX rather than relying on an incomplete or cached price.";
  const featured = $("#featured");
  if (featured) featured.innerHTML = `<div class="form-status error" role="alert">${escapeHtml(message)}</div>`;
  document.querySelectorAll("[data-drawer]").forEach((button) => { button.disabled = true; });
}

const DRAWERS = {
  beyond: { eyebrow: "Beyond peptides", title: "Cellular & metabolic research", copy: "NAD+ · 5-Amino-1MQ" },
  sets: { eyebrow: "Research sets", title: "Wolverine · Glow · Klow", copy: "View the collection" },
  wider: { eyebrow: "Explore", title: "Wider range", copy: "View the wider range" }
};

let selected = [];
let currentDrawer = null;
let detailsOpen = false;
let requestReference = null;

const $ = (selector) => document.querySelector(selector);
const allProducts = () => Object.values(DATA).flat();
const productByCode = (code) => allProducts().find((product) => product.code === code);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[character]));

function createRequestReference() {
  const now = new Date();
  const date = [now.getFullYear().toString().slice(-2), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  return `PX-${date}-${suffix}`;
}

function getRequestReference() {
  if (!requestReference) requestReference = createRequestReference();
  return requestReference;
}

function total() {
  return selected.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function productCard(product, compact = false) {
  const isSelected = selected.some((item) => item.code === product.code);
  const contents = product.contents ? `<p class="card-contents">${escapeHtml(product.contents)}</p>` : "";
  return `<article class="product-card${compact ? " product-card--compact" : ""}" style="--accent:${product.accent}">
    <div class="card-plane" aria-hidden="true"></div>
    <div class="family-id" aria-hidden="true"><span></span></div>
    <h3>${escapeHtml(product.name)}</h3>
    <p class="card-spec">${escapeHtml(product.strength)} <span>·</span> £${product.price}</p>
    ${contents}
    <div class="card-footer"><button class="card-action${isSelected ? " is-selected" : ""}" type="button" data-add="${product.code}" aria-label="${isSelected ? "Added" : "Add"} ${escapeHtml(product.name)} ${escapeHtml(product.strength)}">${isSelected ? "Added" : "Add"}<span aria-hidden="true">${isSelected ? "✓" : "+"}</span></button></div>
    <span class="family-rail" aria-hidden="true"></span>
  </article>`;
}

function addProduct(code) {
  const product = productByCode(code);
  if (!product || selected.some((item) => item.code === code)) return;
  selected.push({ ...product, quantity: 1 });
  resetRequestResult();
  renderAll();
}

function updateQuantity(code, quantity) {
  const wholeQuantity = Math.min(99, Math.max(1, Math.round(Number(quantity) || 1)));
  selected = selected.map((item) => item.code === code ? { ...item, quantity: wholeQuantity } : item);
  resetRequestResult();
  renderRequest();
}

function removeProduct(code) {
  selected = selected.filter((item) => item.code !== code);
  if (!selected.length) {
    detailsOpen = false;
    $("#requestDetails").hidden = true;
  }
  resetRequestResult();
  renderAll();
}

function resetRequestResult() {
  requestReference = null;
  const status = $("#formStatus");
  status.hidden = true;
  status.textContent = "";
  status.className = "form-status";
  $("#copyRequest").hidden = true;
}

function renderFeatured() {
  $("#featured").innerHTML = DATA.featured.map((product) => productCard(product)).join("");
}

function renderDrawer() {
  const drawer = $("#supportDrawer");
  document.querySelectorAll("[data-drawer]").forEach((button) => {
    const isActive = button.dataset.drawer === currentDrawer;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-expanded", String(isActive));
    button.querySelector("b").textContent = isActive ? "×" : "→";
  });

  if (!currentDrawer) {
    drawer.hidden = true;
    return;
  }

  const labels = DRAWERS[currentDrawer];
  $("#drawerEyebrow").textContent = labels.eyebrow;
  $("#drawerTitle").textContent = labels.title;
  $("#drawerCopy").textContent = labels.copy;
  $("#drawerGrid").className = `drawer-grid drawer-grid--${currentDrawer}`;
  $("#drawerGrid").innerHTML = DATA[currentDrawer].map((product) => productCard(product, true)).join("");
  drawer.hidden = false;
}

function renderRequest() {
  const hasItems = selected.length > 0;
  const shell = $("#requestShell");
  shell.classList.toggle("has-items", hasItems);
  shell.classList.toggle("details-open", detailsOpen);
  $("#requestEmpty").hidden = hasItems;
  $("#selectedList").hidden = !hasItems;
  $("#requestFooter").hidden = !hasItems;

  $("#selectedList").innerHTML = selected.map((item) => `<article class="selected-row">
    <div class="selected-identity"><span class="selected-mark" style="background:${item.accent}"></span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.strength)} · £${item.price}${item.contents ? ` · ${escapeHtml(item.contents)}` : ""}</small></div></div>
    <div class="quantity-control" aria-label="Quantity for ${escapeHtml(item.name)}">
      <button type="button" data-quantity="${item.code}" data-delta="-1" aria-label="Reduce ${escapeHtml(item.name)} quantity">−</button>
      <input type="number" min="1" max="99" step="1" value="${item.quantity}" data-quantity-input="${item.code}" inputmode="numeric" aria-label="${escapeHtml(item.name)} quantity">
      <button type="button" data-quantity="${item.code}" data-delta="1" aria-label="Increase ${escapeHtml(item.name)} quantity">+</button>
    </div>
    <strong class="line-total">£${item.price * item.quantity}</strong>
    <button class="remove-action" type="button" data-remove="${item.code}">Remove</button>
  </article>`).join("");

  $("#requestTotal").textContent = `£${total()}`;
  $("#reviewTotal").textContent = `£${total()}`;
  $("#reviewList").innerHTML = selected.map((item) => `<div><span>${escapeHtml(item.name)} ${escapeHtml(item.strength)} × ${item.quantity}${item.contents ? `<small>${escapeHtml(item.contents)}</small>` : ""}</span><strong>£${item.price * item.quantity}</strong></div>`).join("");
}

function renderAll() {
  renderFeatured();
  renderDrawer();
  renderRequest();
}

function openDetails() {
  if (!selected.length) return;
  detailsOpen = true;
  $("#requestShell").classList.add("details-open");
  $("#requestDetails").hidden = false;
  resetRequestResult();
  window.setTimeout(() => $("#requestDetails").scrollIntoView({ behavior: "smooth", block: "start" }), 20);
}

function formValues() {
  return {
    name: $("#name").value.trim(),
    method: $("#method").value,
    email: $("#email").value.trim(),
    whatsapp: $("#whatsapp").value.trim(),
    delivery: $("#delivery").value,
    notes: $("#notes").value.trim(),
    consent: $("#consent").checked
  };
}

function validate() {
  const form = formValues();
  if (!selected.length) return "Add at least one product first.";
  if (!form.name) return "Add your name before continuing.";
  if (!form.email && !form.whatsapp) return "Add an email address or WhatsApp number.";
  if (form.email && !EMAIL_PATTERN.test(form.email)) return "Enter a valid email address.";
  if (form.whatsapp && !WHATSAPP_PATTERN.test(form.whatsapp)) return "Enter a valid WhatsApp number.";
  if (form.method === "Email" && !form.email) return "Add an email address for your preferred reply method.";
  if (form.method === "WhatsApp" && !form.whatsapp) return "Add a WhatsApp number for your preferred reply method.";
  if (!form.consent) return "Confirm the research-use/request acknowledgement.";
  return null;
}

function requestText(reference) {
  const form = formValues();
  const itemLines = selected.map((item) => {
    const base = `- ${item.name} ${item.strength} x${item.quantity} — £${item.price * item.quantity}`;
    return item.contents ? `${base}\n  ${item.contents}` : base;
  }).join("\n");

  return `PRIMEX RESEARCH REQUEST\nReference: ${reference}\n\nName: ${form.name}\nPreferred reply: ${form.method}\nEmail: ${form.email || "Not provided"}\nWhatsApp: ${form.whatsapp || "Not provided"}\nFulfilment preference: ${form.delivery}\n\nRequested products:\n${itemLines}\n\nIndicative total: £${total()}\n\nNotes / questions:\n${form.notes || "None"}`;
}

function showStatus(message, isError = false) {
  const status = $("#formStatus");
  status.className = `form-status${isError ? " error" : ""}`;
  status.textContent = message;
  status.hidden = false;
}

async function writeClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

async function copyRequest() {
  const error = validate();
  if (error) return showStatus(error, true);
  const reference = getRequestReference();
  try {
    await writeClipboard(requestText(reference));
    showStatus(`Request copied. Reference: ${reference}. Paste it into an email to ${EMAIL} and press Send.`);
  } catch {
    showStatus("Copy was unavailable in this browser. Use the email request option instead.", true);
  }
}

function emailRequest() {
  const error = validate();
  if (error) return showStatus(error, true);
  const reference = getRequestReference();
  const form = formValues();
  const subject = encodeURIComponent(`PrimeX research request — ${form.name}`);
  const body = encodeURIComponent(requestText(reference));
  $("#copyRequest").hidden = false;
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  showStatus(`Your email draft should now be open. PrimeX has not received your request until you press Send. Reference: ${reference}.`);
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) return addProduct(addButton.dataset.add);

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) return removeProduct(removeButton.dataset.remove);

  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const item = selected.find((entry) => entry.code === quantityButton.dataset.quantity);
    if (item) updateQuantity(item.code, item.quantity + Number(quantityButton.dataset.delta));
    return;
  }

  const drawerButton = event.target.closest("[data-drawer]");
  if (drawerButton) {
    currentDrawer = currentDrawer === drawerButton.dataset.drawer ? null : drawerButton.dataset.drawer;
    renderDrawer();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-quantity-input]")) updateQuantity(event.target.dataset.quantityInput, Number.parseInt(event.target.value, 10));
});

$("#closeDrawer").addEventListener("click", () => {
  currentDrawer = null;
  renderDrawer();
});
$("#continueAction").addEventListener("click", openDetails);
$("#copyRequest").addEventListener("click", copyRequest);
$("#emailRequest").addEventListener("click", emailRequest);
$("#requestForm").addEventListener("input", resetRequestResult);
$("#requestForm").addEventListener("change", resetRequestResult);

loadCommercialAuthority().then(renderAll).catch((error) => {
  console.error(error);
  showCommercialAuthorityFailure();
});
