"use strict";

const EMAIL = "orders@primexbiolabs.co.uk";
const REQUEST_INTAKE_URL = "https://lamibbavnjwaoiwpqpxj.supabase.co/functions/v1/submit-request";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_PATTERN = /^\+?[0-9()\s-]{7,20}$/;

const DATA = {
  featured: [
    { code: "GHKCU50", name: "GHK-Cu", strength: "50mg", price: 55, accent: "#8f65e5", family: "Family reference 01" },
    { code: "BPC10", name: "BPC-157", strength: "10mg", price: 40, accent: "#f08a2f", family: "Family reference 02" },
    { code: "MOTSC40", name: "MOTS-c", strength: "40mg", price: 95, accent: "#21b89e", family: "Family reference 03" },
    { code: "DSIP5", name: "DSIP", strength: "5mg", price: 55, accent: "#a76be5", family: "Family reference 04" }
  ],
  beyond: [
    { code: "NAD500", name: "NAD+", strength: "500mg", price: 49, accent: "#3f9fe4", family: "Family reference 05" },
    { code: "AMINO1MQ50", name: "5-Amino-1MQ", strength: "50mg", price: 110, accent: "#8294a5", family: "Family reference 06" }
  ],
  sets: [
    { code: "SET-WOLV10", name: "Wolverine", strength: "2 separate vials", price: 100, accent: "#f08a2f", family: "Research set", contents: "BPC-157 10mg + TB-500 10mg · separate vials" },
    { code: "SET-GLOW70", name: "Glow", strength: "3 separate vials", price: 140, accent: "#8f65e5", family: "Research set", contents: "GHK-Cu 50mg + BPC-157 10mg + TB-500 10mg · separate vials" },
    { code: "SET-KLOW80", name: "Klow", strength: "4 separate vials", price: 195, accent: "#7f92a6", family: "Research set", contents: "GHK-Cu 50mg + BPC-157 10mg + TB-500 10mg + KPV 10mg · separate vials" }
  ],
  wider: [
    { code: "RTA20", name: "Retatrutide", strength: "20mg", price: 150, accent: "#5d7fd6", family: "Family reference 07" },
    { code: "TB50010", name: "TB-500", strength: "10mg", price: 65, accent: "#f08a2f", family: "Family reference 02" },
    { code: "KPV10", name: "KPV", strength: "10mg", price: 55, accent: "#8294a5", family: "Family reference 06" },
    { code: "TA110", name: "Thymosin Alpha-1", strength: "10mg", price: 75, accent: "#a76be5", family: "Family reference 04" },
    { code: "SS31_30", name: "SS-31", strength: "30mg", price: 95, accent: "#3f9fe4", family: "Family reference 05" }
  ]
};

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

  return `PRIMEX RESEARCH REQUEST\nReference: ${reference}\n\nName: ${form.name}\nPreferred reply: ${form.method}\nEmail: ${form.email || "Not provided"}\nWhatsApp: ${form.whatsapp || "Not provided"}\nFulfilment preference: ${form.delivery}\n\nRequested products:\n${itemLines}\n\nIndicative total: £${total()}\n\nNotes / questions:\n${form.notes || "None"}\n\nResearch Use Only. Not for human or veterinary use.\nAvailability, fulfilment and next steps are confirmed separately.`;
}

function requestPayload(reference) {
  const form = formValues();
  return {
    requestId: reference,
    receivedAt: new Date().toISOString(),
    source: "PrimeX Planner",
    status: "new",
    customer: {
      name: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      contact: form.whatsapp || form.email,
      preferredContact: form.method
    },
    items: selected.map((item) => ({
      productCode: item.code,
      requestedName: item.name,
      requestedStrength: item.strength,
      qty: item.quantity,
      standardCataloguePrice: item.price,
      priceMode: "fixed",
      publicSafeNotes: item.contents || ""
    })),
    requestNotes: form.notes,
    publicSafeNotes: `Fulfilment preference: ${form.delivery}`
  };
}

async function submitCloudRequest(reference) {
  const response = await fetch(REQUEST_INTAKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestPayload(reference))
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || "Request intake unavailable");
  return result;
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
    showStatus(`Request copied. Reference: ${reference}. Paste it into WhatsApp or email to send it to PrimeX.`);
  } catch {
    showStatus("Copy was unavailable in this browser. Use the email request option instead.", true);
  }
}

async function emailRequest() {
  const error = validate();
  if (error) return showStatus(error, true);
  const reference = getRequestReference();
  const form = formValues();
  const subject = encodeURIComponent(`PrimeX research request — ${form.name}`);
  const body = encodeURIComponent(requestText(reference));
  try {
    await submitCloudRequest(reference);
  } catch {
    // The existing email handoff remains the operational fallback.
  }
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  showStatus(`Your completed request is ready in your email app. Reference: ${reference}. Send it when you’re ready.`);
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

renderAll();
