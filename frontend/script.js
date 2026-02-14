const API_URL = "http://localhost:3000/products";

let currentSort = "";
let sortOrder = "asc";

let deleteProductId = null;
let deleteButtonRef = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  const confirmBtn = document.getElementById("confirmDeleteBtn");

  confirmBtn.addEventListener("click", async () => {
    if (!deleteProductId) return;

    const btn = deleteButtonRef;
    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerText = "Deleting...";

    try {
      await apiRequest(`${API_URL}/${deleteProductId}`, {
        method: "DELETE"
      });

      showToast("Product deleted successfully", "success");
      loadProducts();
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled = false;
      btn.innerText = originalText;
    }

    deleteProductId = null;
    deleteButtonRef = null;

    bootstrap.Modal.getInstance(
      document.getElementById("confirmModal")
    ).hide();
  });
});

/**
 * Show Bootstrap toast
 * type: success | error | info
 */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const bgClass =
    type === "success"
      ? "bg-success"
      : type === "error"
      ? "bg-danger"
      : "bg-secondary";

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-white ${bgClass} border-0`;
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

/**
 * API helper
 */
async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Request failed");
    }

    return result.data ?? null;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Server is not running");
    }
    throw err;
  }
}

/**
 * Load products with loading state
 */
async function loadProducts() {
  const tableBody = document.getElementById("productTable");

  // Loading state
  tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">
        Loading...
      </td>
    </tr>
  `;

  const searchInput = document.getElementById("search");
  const search = searchInput ? searchInput.value.trim() : "";

  const params = new URLSearchParams();

  if (search) params.append("name", search);

  if (currentSort) {
    params.append("sort", currentSort);
    params.append("order", sortOrder);
  }

  const url = params.toString()
    ? `${API_URL}?${params.toString()}`
    : API_URL;

  try {
    const products = await apiRequest(url);
    renderProducts(products || []);
  } catch (err) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger">
          ${escapeHtml(err.message)}
        </td>
      </tr>
    `;
  }
}

/**
 * Render table
 */
function renderProducts(products) {
  const tableBody = document.getElementById("productTable");
  tableBody.innerHTML = "";

  if (!products || products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          No products found
        </td>
      </tr>
    `;
    return;
  }

  products.forEach(product => {
    const row = document.createElement("tr");
    row.id = `row-${product.id}`;

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${escapeHtml(product.name)}</td>
      <td class="${product.quantity === 0 ? "text-danger fw-bold" : ""}">
        ${product.quantity}
      </td>
      <td>
        <button class="btn btn-sm btn-primary me-2"
          onclick="enableEdit(${product.id}, '${encodeURIComponent(
      product.name
    )}', ${product.quantity})">
          Edit
        </button>
        <button class="btn btn-sm btn-danger"
          onclick="deleteProduct(${product.id}, this)">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Enable inline edit
 */
function enableEdit(id, encodedName, quantity) {
  const name = decodeURIComponent(encodedName);
  const row = document.getElementById(`row-${id}`);

  row.innerHTML = `
    <td>${id}</td>
    <td>
      <input class="form-control form-control-sm"
        id="edit-name-${id}" value="${escapeHtml(name)}">
    </td>
    <td>
      <input type="number" class="form-control form-control-sm"
        id="edit-qty-${id}" value="${quantity}" style="width:100px">
    </td>
    <td>
      <button class="btn btn-sm btn-success me-2"
        onclick="saveUpdate(${id}, this)">Save</button>
      <button class="btn btn-sm btn-secondary"
        onclick="loadProducts()">Cancel</button>
    </td>
  `;
}

/**
 * Save update 
 */
async function saveUpdate(id, btn) {
  const originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = "Saving...";

  const name = document.getElementById(`edit-name-${id}`).value.trim();
  const quantity = Number(document.getElementById(`edit-qty-${id}`).value);

  if (!name) {
    showToast("Name is required", "error");
    btn.disabled = false;
    btn.innerText = originalText;
    return;
  }

  if (quantity < 0 || isNaN(quantity)) {
    showToast("Enter valid quantity", "error");
    btn.disabled = false;
    btn.innerText = originalText;
    return;
  }

  try {
    await apiRequest(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity })
    });

    showToast("Product updated successfully", "success");
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.innerText = originalText;
  }
}

/**
 * Add product
 */
async function addProduct(btn) {
  const nameInput = document.getElementById("name");
  const quantityInput = document.getElementById("quantity");

  const name = nameInput.value.trim();
  const quantity = Number(quantityInput.value);

  if (!name || quantity < 0 || isNaN(quantity)) {
    showToast("Please enter valid product data", "error");
    return;
  }

  const originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = "Adding...";

  try {
    await apiRequest(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity })
    });

    nameInput.value = "";
    quantityInput.value = "";

    showToast("Product added successfully", "success");
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerText = originalText;
  }
}

/**
 * Delete product
 */
async function deleteProduct(id, btn) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = "Deleting...";

  try {
    await apiRequest(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    showToast("Product deleted successfully", "success");
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.innerText = originalText;
  }
}

/**
 * Sorting
 */
function setSort(field) {
  if (currentSort === field) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    currentSort = field;
    sortOrder = "asc";
  }

  updateSortIndicators();
  loadProducts();
}

function updateSortIndicators() {
  const nameSortEl = document.getElementById("nameSort");
  const qtySortEl = document.getElementById("qtySort");

  if (nameSortEl) {
    nameSortEl.textContent =
      currentSort === "name" ? (sortOrder === "asc" ? " ▲" : " ▼") : "";
  }

  if (qtySortEl) {
    qtySortEl.textContent =
      currentSort === "quantity"
        ? (sortOrder === "asc" ? " ▲" : " ▼")
        : "";
  }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}
