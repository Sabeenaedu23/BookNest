
const books = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Fiction",
    price: 399,
    tag: "Bestseller",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    description: "Alicia Berenson's life is seemingly perfect. An artist married to an in-demand fashion photographer, she lives in a grand house overlooking a London park. Until one evening, her husband is found dead."
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-help",
    price: 499,
    tag: "Popular",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
    description: "A practical guide to building good habits, breaking bad ones and making small improvements that lead to remarkable results."
  },
  {
    id: 3,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Business",
    price: 349,
    tag: "Editor's Pick",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    description: "Timeless lessons on wealth, greed and happiness. Discover how people think about money and why behaviour matters more than numbers."
  },
  {
    id: 4,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    category: "Romance",
    price: 429,
    tag: "Trending",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500",
    description: "A compelling story about love, difficult choices and finding the courage to build a different future."
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Business",
    price: 379,
    tag: "Reader's Choice",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500",
    description: "Learn how to focus without distraction on cognitively demanding tasks and produce meaningful work in a distracted world."
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: 699,
    tag: "Developer Pick",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
    description: "A practical guide to writing clean, readable and maintainable code. An essential read for developers who care about software quality."
  },
  {
    id: 7,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: 299,
    tag: "Classic",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=500",
    description: "A young shepherd travels in search of treasure and discovers that the greatest journey is the one that teaches us about ourselves."
  },
  {
    id: 8,
    title: "Ikigai",
    author: "Héctor García",
    category: "Self-help",
    price: 329,
    tag: "Bestseller",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500",
    description: "Discover the Japanese concept of finding purpose and meaning in everyday life through small habits and meaningful connections."
  }
];

// Application state
let cart = JSON.parse(localStorage.getItem("booknest-cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("booknest-wishlist")) || [];
let activeCategory = "All";
let searchTerm = "";
let activePanel = "cart";

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
const bookTotal = document.getElementById("bookTotal");
const overlay = document.getElementById("overlay");
const sidePanel = document.getElementById("sidePanel");
const panelItems = document.getElementById("panelItems");
const panelFooter = document.getElementById("panelFooter");
const modalOverlay = document.getElementById("modalOverlay");
const toast = document.getElementById("toast");

// Currency formatting
const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

// Save application data
function saveData() {
  localStorage.setItem("booknest-cart", JSON.stringify(cart));
  localStorage.setItem("booknest-wishlist", JSON.stringify(wishlist));
  updateCounts();
}

// Show notification
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Update header counters
function updateCounts() {
  document.getElementById("cartCount").textContent =
    cart.reduce((total, item) => total + item.quantity, 0);

  document.getElementById("wishCount").textContent =
    wishlist.length;
}

// Render books
function renderBooks() {
  let filtered = books.filter(book => {
    const matchesCategory =
      activeCategory === "All" ||
      book.category === activeCategory;

    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  switch (sortSelect.value) {
    case "low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  bookTotal.textContent =
    `${filtered.length} BOOK${filtered.length !== 1 ? "S" : ""}`;

  emptyState.hidden = filtered.length !== 0;
  bookGrid.style.display = filtered.length ? "grid" : "none";

  bookGrid.innerHTML = filtered.map(book => `
    <article class="book-card">
      <div class="book-cover">
        <img src="${book.image}" alt="${book.title} book cover"
             loading="lazy">
        <span class="book-tag">${book.tag}</span>

        <button class="wish-btn ${wishlist.includes(book.id) ? "selected" : ""}"
          data-wish="${book.id}"
          aria-label="Toggle wishlist">
          ${wishlist.includes(book.id) ? "♥" : "♡"}
        </button>

        <button class="quick-view" data-preview="${book.id}">
          QUICK VIEW ↗
        </button>
      </div>

      <div class="book-info">
        <span class="book-category">${book.category}</span>
        <h3>${book.title}</h3>
        <p class="author">By ${book.author}</p>

        <div class="book-bottom">
          <span class="price">${money(book.price)}</span>
          <button class="add-btn" data-add="${book.id}">
            + Add to bag
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Category filtering
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  activeCategory = button.dataset.category;
  renderBooks();
});

// Search
searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.toLowerCase().trim();
  renderBooks();
});

// Sorting
sortSelect.addEventListener("change", renderBooks);

// Wishlist toggle
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from your wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to your wishlist ♥");
  }

  saveData();
  renderBooks();

  if (activePanel === "wishlist" && sidePanel.classList.contains("show")) {
    renderPanel();
  }
}

// Add book to cart
function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveData();
  showToast("Your book has been added to the bag!");
}

// Cart quantity adjustment
function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(book => book.id !== id);
  }

  saveData();
  renderPanel();
}

// Remove item
function removeItem(id) {
  if (activePanel === "cart") {
    cart = cart.filter(item => item.id !== id);
  } else {
    wishlist = wishlist.filter(item => item !== id);
  }

  saveData();
  renderPanel();
  renderBooks();
  showToast("Item removed");
}

// Event delegation for book cards
bookGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wish]");
  const previewButton = event.target.closest("[data-preview]");

  if (addButton) addToCart(Number(addButton.dataset.add));
  if (wishButton) toggleWishlist(Number(wishButton.dataset.wish));
  if (previewButton) openPreview(Number(previewButton.dataset.preview));
});

// Open preview modal
function openPreview(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-layout">
      <img src="${book.image}" alt="${book.title}">
      <div>
        <span class="book-category">${book.category}</span>
        <h2>${book.title}</h2>
        <span class="author">By ${book.author}</span>
        <p>★ ${book.rating} / 5 · Reader favourite</p>
        <p>${book.description}</p>
        <span class="price">${money(book.price)}</span>
        <button class="primary-btn" data-modal-add="${book.id}">
          Add to bag ↗
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add("show");
}

document.getElementById("modalContent").addEventListener("click", event => {
  const button = event.target.closest("[data-modal-add]");
  if (!button) return;

  addToCart(Number(button.dataset.modalAdd));
  modalOverlay.classList.remove("show");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("show");
});

modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("show");
  }
});

// Open shopping panels
function openPanel(type) {
  activePanel = type;
  document.getElementById("panelTitle").textContent =
    type === "cart" ? "Your Shopping Bag" : "Your Wishlist";

  sidePanel.classList.add("show");
  overlay.classList.add("show");
  renderPanel();
}

function closePanel() {
  sidePanel.classList.remove("show");
  overlay.classList.remove("show");
}

document.getElementById("cartToggle").addEventListener("click", () => openPanel("cart"));
document.getElementById("wishlistToggle").addEventListener("click", () => openPanel("wishlist"));
document.getElementById("closePanel").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

// Render cart or wishlist
function renderPanel() {
  if (activePanel === "cart") {
    const total = cart.reduce((sum, item) => {
      const book = books.find(b => b.id === item.id);
      return sum + (book ? book.price * item.quantity : 0);
    }, 0);

    if (!cart.length) {
      panelItems.innerHTML = `<div class="panel-empty">
        <h3>Your bag is waiting.</h3>
        <p>Discover something worth reading.</p>
      </div>`;
      panelFooter.innerHTML = "";
      return;
    }

    panelItems.innerHTML = cart.map(item => {
      const book = books.find(b => b.id === item.id);
      if (!book) return "";

      return `
        <div class="panel-item">
          <img src="${book.image}" alt="${book.title}">
          <div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <strong>${money(book.price)}</strong>
            <div class="item-actions">
              <button data-quantity="${book.id}" data-change="-1">−</button>
              <span>${item.quantity}</span>
              <button data-quantity="${book.id}" data-change="1">+</button>
              <button class="remove" data-remove="${book.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    panelFooter.innerHTML = `
      <p><span>Subtotal</span><strong>${money(total)}</strong></p>
      <button class="primary-btn" id="checkoutBtn">Continue to checkout ↗</button>
    `;

  } else {
    const savedBooks = books.filter(book => wishlist.includes(book.id));

    if (!savedBooks.length) {
      panelItems.innerHTML = `<div class="panel-empty">
        <h3>No favourites yet.</h3>
        <p>Save books you would love to read.</p>
      </div>`;
      panelFooter.innerHTML = "";
      return;
    }

    panelItems.innerHTML = savedBooks.map(book => `
      <div class="panel-item">
        <img src="${book.image}" alt="${book.title}">
        <div>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <strong>${money(book.price)}</strong>
          <div class="item-actions">
            <button data-add="${book.id}">Add to bag</button>
            <button class="remove" data-remove="${book.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");

    panelFooter.innerHTML = "";
  }
}

// Panel event delegation
panelItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  const addButton = event.target.closest("[data-add]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeItem(Number(removeButton.dataset.remove));
  }

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    renderPanel();
  }
});

// Demo checkout
panelFooter.addEventListener("click", event => {
  if (event.target.id === "checkoutBtn") {
    showToast("Demo store: Checkout integration coming soon!");
  }
});

// Search shortcut
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => searchInput.focus(), 400);
});

// Reset filters
document.getElementById("resetFilters").addEventListener("click", () => {
  activeCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  sortSelect.value = "featured";

  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle("active", button.dataset.category === "All");
  });

  renderBooks();
});

// Mobile navigation
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
  });
});

// Newsletter demo
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = document.getElementById("emailInput");
  document.getElementById("newsletterMessage").textContent =
    "Thank you! Your email has been accepted in this demo.";

  email.value = "";
});

// Escape key closes overlays
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePanel();
    modalOverlay.classList.remove("show");
  }
});

// Initial render
renderBooks();
updateCounts();
