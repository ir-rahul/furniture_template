// Customization state
let customizationState = {
  color: "beige",
  material: "fabric",
  size: "medium",
  addons: [],
  basePrice: 1299,
  totalPrice: 1299,
};

// Price modifiers
const priceModifiers = {
  colors: {
    beige: 0,
    brown: 50,
    gray: 25,
    navy: 75,
    green: 60,
    burgundy: 100,
  },
  materials: {
    fabric: 0,
    leather: 200,
    velvet: 150,
    linen: 75,
  },
  sizes: {
    small: -200,
    medium: 0,
    large: 350,
  },
  addons: {
    cushions: 45,
    ottoman: 120,
    warranty: 85,
  },
};

// Material and color combinations for AR
const materialTextures = {
  fabric: {
    beige: "#d4c5a8",
    brown: "#8b4513",
    gray: "#808080",
    navy: "#1e3a8a",
    green: "#16a34a",
    burgundy: "#7c2d12",
  },
  leather: {
    beige: "#ddbf94",
    brown: "#964b00",
    gray: "#696969",
    navy: "#000080",
    green: "#006400",
    burgundy: "#800020",
  },
  velvet: {
    beige: "#c9b382",
    brown: "#704214",
    gray: "#606060",
    navy: "#191970",
    green: "#228b22",
    burgundy: "#8b0000",
  },
  linen: {
    beige: "#f5f5dc",
    brown: "#a0522d",
    gray: "#a9a9a9",
    navy: "#4682b4",
    green: "#9acd32",
    burgundy: "#a0522d",
  },
};

// Initialize customization
function initializeCustomization() {
  // Color selection
  document.querySelectorAll(".color-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".color-option")
        .forEach((o) => o.classList.remove("active"));
      this.classList.add("active");
      customizationState.color = this.dataset.color;
      updateModel();
      updatePrice();
    });
  });

  // Material selection
  document.querySelectorAll(".material-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".material-option")
        .forEach((o) => o.classList.remove("active"));
      this.classList.add("active");
      customizationState.material = this.dataset.material;
      updateModel();
      updatePrice();
    });
  });

  // Size selection
  document.querySelectorAll(".size-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".size-option")
        .forEach((o) => o.classList.remove("active"));
      this.classList.add("active");
      customizationState.size = this.dataset.size;
      updateModel();
      updatePrice();
    });
  });

  // Addon selection
  document.querySelectorAll(".config-option").forEach((option) => {
    option.addEventListener("click", function () {
      const addon = this.dataset.config;
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        customizationState.addons = customizationState.addons.filter(
          (a) => a !== addon
        );
      } else {
        this.classList.add("active");
        customizationState.addons.push(addon);
      }
      updatePrice();
    });
  });
}

// Update 3D model based on customization
function updateModel() {
  const modelViewer = document.getElementById("modelViewer");

  if (modelViewer && modelViewer.model) {
    const color =
      materialTextures[customizationState.material][customizationState.color];

    // Update material properties
    modelViewer.model.materials.forEach((material, index) => {
      if (material.pbrMetallicRoughness) {
        // Update base color
        const rgb = hexToRgb(color);
        material.pbrMetallicRoughness.setBaseColorFactor([
          rgb.r / 255,
          rgb.g / 255,
          rgb.b / 255,
          1.0,
        ]);

        // Adjust material properties based on material type
        switch (customizationState.material) {
          case "leather":
            material.pbrMetallicRoughness.setRoughnessFactor(0.3);
            material.pbrMetallicRoughness.setMetallicFactor(0.1);
            break;
          case "velvet":
            material.pbrMetallicRoughness.setRoughnessFactor(0.8);
            material.pbrMetallicRoughness.setMetallicFactor(0.0);
            break;
          case "fabric":
            material.pbrMetallicRoughness.setRoughnessFactor(0.7);
            material.pbrMetallicRoughness.setMetallicFactor(0.0);
            break;
          case "linen":
            material.pbrMetallicRoughness.setRoughnessFactor(0.9);
            material.pbrMetallicRoughness.setMetallicFactor(0.0);
            break;
        }
      }
    });

    // Update model scale based on size
    const scaleMap = {
      small: 0.8,
      medium: 1.0,
      large: 1.2,
    };

    const scale = scaleMap[customizationState.size];
    modelViewer.scale = `${scale} ${scale} ${scale}`;
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Update price display
function updatePrice() {
  let totalPrice = customizationState.basePrice;

  // Add color modifier
  totalPrice += priceModifiers.colors[customizationState.color] || 0;

  // Add material modifier
  totalPrice += priceModifiers.materials[customizationState.material] || 0;

  // Add size modifier
  totalPrice += priceModifiers.sizes[customizationState.size] || 0;

  // Add addon modifiers
  customizationState.addons.forEach((addon) => {
    totalPrice += priceModifiers.addons[addon] || 0;
  });

  customizationState.totalPrice = totalPrice;

  // Update display with animation
  const priceElement = document.getElementById("currentPrice");
  priceElement.style.transform = "scale(1.1)";
  priceElement.style.color = "#c49b61";

  setTimeout(() => {
    priceElement.textContent = `${totalPrice.toLocaleString()}`;
    priceElement.style.transform = "scale(1)";
  }, 150);
}

// Launch AR with customization
function launchCustomAR() {
  const modelViewer = document.getElementById("modelViewer");
  showLoading();

  // Apply customization before AR
  updateModel();

  setTimeout(() => {
    if (modelViewer.canActivateAR) {
      modelViewer
        .activateAR()
        .then(() => {
          hideLoading();
          document.getElementById("arOverlay").classList.add("active");

          // Track AR session with customization
          console.log("AR launched with customization:", customizationState);

          // Optional: Send analytics
          if (typeof gtag !== "undefined") {
            gtag("event", "ar_launch", {
              custom_category: "furniture_customization",
              color: customizationState.color,
              material: customizationState.material,
              size: customizationState.size,
              price: customizationState.totalPrice,
            });
          }
        })
        .catch((error) => {
          hideLoading();
          console.error("AR activation failed:", error);
          alert("AR not supported on this device. Viewing in 3D mode instead.");
        });
    } else {
      hideLoading();
      alert("AR is not supported on this device or browser.");
    }
  }, 1000);
}

// Close AR session
function closeAR() {
  const modelViewer = document.getElementById("modelViewer");
  document.getElementById("arOverlay").classList.remove("active");

  // Exit AR if active
  if (modelViewer.ar && modelViewer.ar.status === "session-started") {
    modelViewer.ar.stop();
  }
}

// Reset customization to defaults
function resetCustomization() {
  customizationState = {
    color: "beige",
    material: "fabric",
    size: "medium",
    addons: [],
    basePrice: 1299,
    totalPrice: 1299,
  };

  // Reset UI
  document
    .querySelectorAll(".color-option")
    .forEach((o) => o.classList.remove("active"));
  document.querySelector('[data-color="beige"]').classList.add("active");

  document
    .querySelectorAll(".material-option")
    .forEach((o) => o.classList.remove("active"));
  document.querySelector('[data-material="fabric"]').classList.add("active");

  document
    .querySelectorAll(".size-option")
    .forEach((o) => o.classList.remove("active"));
  document.querySelector('[data-size="medium"]').classList.add("active");

  document
    .querySelectorAll(".config-option")
    .forEach((o) => o.classList.remove("active"));

  // Reset model and price
  updateModel();
  updatePrice();
}

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".nav-dot");

function showSlide(index) {
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");

  currentSlide = index;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

// Auto-advance slider
setInterval(() => {
  const nextSlide = (currentSlide + 1) % slides.length;
  showSlide(nextSlide);
}, 5000);

// 3D Model functions with loading states
function showLoading() {
  document.getElementById("loadingOverlay").classList.add("active");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
}

function openModelView() {
  showLoading();

  setTimeout(() => {
    const modelSection = document.getElementById("model-section");
    modelSection.style.display = "block";

    // Smooth scroll to model section
    modelSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    hideLoading();
  }, 1000);
}

function openAR() {
  showLoading();

  setTimeout(() => {
    const modelViewer = document.getElementById("modelViewer");
    if (modelViewer.canActivateAR) {
      modelViewer
        .activateAR()
        .then(() => {
          hideLoading();
        })
        .catch((error) => {
          hideLoading();
          alert("AR not supported on this device or browser.");
        });
    } else {
      hideLoading();
      alert("AR is not supported on this device or browser.");
    }
  }, 800);
}

// Mobile responsive menu toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  navMenu.classList.toggle("mobile-active");
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const modelViewer = document.getElementById("modelViewer");

  // Initialize customization
  initializeCustomization();

  // Model viewer event listeners
  modelViewer.addEventListener("load", () => {
    console.log("3D model loaded successfully");
    hideLoading();
  });

  modelViewer.addEventListener("error", (event) => {
    console.error("Model loading error:", event.detail);
    hideLoading();
  });

  // AR session handling
  modelViewer.addEventListener("ar-status", (event) => {
    if (event.detail.status === "session-started") {
      console.log("AR session started successfully");
    } else if (event.detail.status === "failed") {
      console.log("AR session failed to start");
      alert("AR is not supported on this device or browser");
    }
  });

  // Mobile menu setup
  const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

  function handleMobileChange(e) {
    if (e.matches) {
      const navMenu = document.querySelector(".nav-menu");
      const hamburger = document.createElement("div");
      hamburger.className = "hamburger-menu";
      hamburger.innerHTML = "☰";
      hamburger.onclick = toggleMobileMenu;

      if (!document.querySelector(".hamburger-menu")) {
        document.querySelector(".nav-actions").prepend(hamburger);
      }
    }
  }

  mobileMediaQuery.addListener(handleMobileChange);
  handleMobileChange(mobileMediaQuery);

  // Intersection Observer for animations
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .product-card").forEach((el) => {
    animationObserver.observe(el);
  });
});

// Smooth header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
});

// Performance monitoring
function measurePerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "Page load time:",
        perfData.loadEventEnd - perfData.loadEventStart
      );
    });
  }
}

measurePerformance();

// Service Worker for caching (if available)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch((error) => {
    console.log("Service Worker registration failed:", error);
  });
}
