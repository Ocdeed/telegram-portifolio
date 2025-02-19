const chatArea = document.getElementById("chat-area");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-message");
const themeToggle = document.getElementById("theme-toggle");
const attachButton = document.getElementById("attach-file");
const fabContainer = document.querySelector(".fab-container");
const mainFab = document.querySelector(".main-fab");
const statusIndicator = document.querySelector(".status");

// Add after your initial constants
const inputContainer = document.querySelector(".input-container");

// Add after initial constants
let selectedMessages = [];

let awaitingClearConfirmation = false;
let typingTimeout;

// Add to your existing variables
let activeSuggestions = false;

// Bot information and responses
const botInfo = {
  name: "Octavian Bot",
  location: "Dar es Salaam, Tanzania",
  resume: "./assets/Octavian_Resume.pdf", // Update this path to match your actual resume file
  contacts: {
    email: "octavian@example.com",
    whatsapp: "+255123456789",
    phone: "+255123456789",
    linkedin: "https://linkedin.com/in/octavian",
    twitter: "https://twitter.com/octavian",
    github: "https://github.com/octavian",
  },
  skills: {
    programming: ["Python", "JavaScript", "Java", "C++"],
    web: ["React", "Node.js", "HTML/CSS", "Express"],
    database: ["MongoDB", "PostgreSQL", "Redis"],
    tools: ["Git", "Docker", "AWS", "Linux"],
    soft: ["Problem Solving", "Team Leadership", "Communication"],
  },
  projects: {
    1: {
      name: "AI Chat Assistant",
      description:
        "A sophisticated chatbot using natural language processing and machine learning for intelligent conversations.",
      tech: "Python, TensorFlow, Flask",
      preview: "https://example.com/ai-chat-preview",
      code: "https://github.com/octavian/ai-chat",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    2: {
      name: "Mobile App",
      description:
        "Cross-platform mobile application for task management with real-time synchronization.",
      tech: "React Native, Firebase",
      preview: "https://example.com/mobile-app-preview",
      code: "https://github.com/octavian/mobile-app",
      image:
        "https://images.pexels.com/photos/5082576/pexels-photo-5082576.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    3: {
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with payment integration and inventory management.",
      tech: "MERN Stack, Stripe",
      preview: "https://example.com/ecommerce-preview",
      code: "https://github.com/octavian/ecommerce",
      image:
        "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    4: {
      name: "ML Project",
      description:
        "Machine learning project for predictive analytics with data visualization.",
      tech: "Python, Scikit-learn, Pandas",
      preview: "https://example.com/ml-preview",
      code: "https://github.com/octavian/ml-project",
      image:
        "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    5: {
      name: "Portfolio Website",
      description:
        "Personal portfolio website with Telegram-like chat interface.",
      tech: "HTML, CSS, JavaScript",
      preview: "https://example.com/portfolio-preview",
      code: "https://github.com/octavian/portfolio",
      image:
        "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  },
  githubProfile: "https://github.com/octavian",
  services: {
    1: {
      title: "Website Development",
      description:
        "Custom responsive websites built with modern technologies. Includes design, development, and deployment.",
      price: "TSh 1,500,000",
      duration: "per project",
      icon: "fas fa-laptop-code",
    },
    2: {
      title: "SEO Optimization",
      description:
        "Improve your website's search engine ranking with comprehensive SEO strategy and implementation.",
      price: "TSh 300,000",
      duration: "per month",
      icon: "fas fa-search",
    },
    3: {
      title: "E-commerce Solutions",
      description:
        "Full-featured online stores with payment integration, inventory management, and admin dashboard.",
      price: "TSh 2,000,000",
      duration: "per project",
      icon: "fas fa-shopping-cart",
    },
    4: {
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile applications for iOS and Android.",
      price: "TSh 3,000,000",
      duration: "per project",
      icon: "fas fa-mobile-alt",
    },
    5: {
      title: "Web Maintenance",
      description:
        "Regular updates, security patches, backups, and technical support for your website.",
      price: "TSh 200,000",
      duration: "per month",
      icon: "fas fa-tools",
    },
  },
};

// Add these constants at the top
const LOCATION_COORDS = {
  lat: -6.8235, // Dar es Salaam coordinates
  lng: 39.2695,
};

// Add this global variable
let map = null;

// Add this function for map initialization
window.initMap = function () {
  // Map is ready to be used
  console.log("Google Maps loaded");
};

// Add at the top with other constants
const API_URL = "http://localhost:5000/api";

// Add API handling functions
async function saveMessageToServer(message) {
  try {
    await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

async function submitInquiry(data) {
  try {
    const response = await fetch(`${API_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    throw error;
  }
}

// Message templates
const welcomeMessage = `👋 Hello! I'm <strong>${botInfo.name}</strong>

I'm a student at the <strong>University of Dar es Salaam</strong> passionate about technology and innovation.

🎯 I'm actively seeking opportunities in:
• <strong>Software Engineering</strong>
• <strong>Business Development</strong>
• <strong>IT Solutions</strong>

Type <strong>/help</strong> to see what I can do! 🚀`;

const helpMessage = `Available commands:

📚 <strong>Information</strong>
• /skills - View my technical skills
• /projects - Browse my portfolio
• /services - View my services & pricing
• /contact - Get my contact details
• /location - See where I'm based
• /resume - Download my CV

⚙️ <strong>Chat Controls</strong>
• /clear - Clear chat history
• /help - Show this menu

Feel free to ask me anything! 😊`;

// Event Listeners
window.addEventListener("load", () => {
  sendBotMessage(welcomeMessage);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});

sendButton.addEventListener("click", handleMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleMessage();
});

attachButton.addEventListener("click", () => {
  sendBotMessage("📎 This feature is coming soon!");
});

mainFab.addEventListener("click", () => {
  fabContainer.classList.toggle("active");
});

document.querySelectorAll(".fab-option").forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    handleCommand(command);
    fabContainer.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!fabContainer.contains(e.target)) {
    fabContainer.classList.remove("active");
  }
});

// Add input focus handlers
messageInput.addEventListener("focus", () => {
  inputContainer.classList.add("focused");
});

messageInput.addEventListener("blur", () => {
  inputContainer.classList.remove("focused");
});

// Add command suggestions handling
messageInput.addEventListener("input", (e) => {
  const value = e.target.value;

  if (value === "/") {
    showCommandSuggestions();
    activeSuggestions = true;
  } else if (!value.startsWith("/")) {
    hideCommandSuggestions();
    activeSuggestions = false;
  } else if (activeSuggestions) {
    filterCommandSuggestions(value.slice(1));
  }
});

function showCommandSuggestions() {
  // Remove existing suggestions if any
  hideCommandSuggestions();

  const template = document.getElementById("command-suggestions-template");
  const suggestions = template.content.cloneNode(true);
  inputContainer.appendChild(suggestions);

  // Add click handlers to suggestions
  document.querySelectorAll(".command-item").forEach((item) => {
    item.addEventListener("click", () => {
      const command = item.dataset.command;
      messageInput.value = `/${command} `;
      messageInput.focus();
      hideCommandSuggestions();
    });
  });
}

function hideCommandSuggestions() {
  const existing = document.querySelector(".command-suggestions");
  if (existing) {
    existing.remove();
  }
}

function filterCommandSuggestions(query) {
  const suggestions = document.querySelectorAll(".command-item");
  const lowercaseQuery = query.toLowerCase();

  suggestions.forEach((item) => {
    const command = item.dataset.command;
    if (command.includes(lowercaseQuery)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// Add keyboard navigation for suggestions
messageInput.addEventListener("keydown", (e) => {
  const suggestions = document.querySelector(".command-suggestions");
  if (!suggestions) return;

  const items = [
    ...suggestions.querySelectorAll(
      '.command-item:not([style*="display: none"])'
    ),
  ];
  const activeItem = suggestions.querySelector(".command-item.active");
  const activeIndex = items.indexOf(activeItem);

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (activeItem) {
        items[activeIndex].classList.remove("active");
        items[(activeIndex + 1) % items.length].classList.add("active");
      } else {
        items[0]?.classList.add("active");
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      if (activeItem) {
        items[activeIndex].classList.remove("active");
        items[
          activeIndex - 1 >= 0 ? activeIndex - 1 : items.length - 1
        ].classList.add("active");
      } else {
        items[items.length - 1]?.classList.add("active");
      }
      break;

    case "Enter":
      if (activeItem) {
        e.preventDefault();
        const command = activeItem.dataset.command;
        messageInput.value = `/${command} `;
        hideCommandSuggestions();
      }
      break;

    case "Escape":
      hideCommandSuggestions();
      break;
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-container")) {
    hideCommandSuggestions();
  }
});

// Message Handling
function handleMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Clear any existing typing indicators
  hideTypingIndicator();

  addUserMessage(message);
  messageInput.value = "";

  if (awaitingClearConfirmation) {
    if (message.toLowerCase() === "yes") {
      chatArea.innerHTML = "";
      sendBotMessage("🧹 Chat history cleared!");
      setTimeout(() => {
        sendBotMessage(welcomeMessage);
      }, 500);
    } else if (message.toLowerCase() === "no") {
      sendBotMessage("❌ Chat clear cancelled.");
    }
    awaitingClearConfirmation = false;
    return;
  }

  if (message.startsWith("/")) {
    handleCommand(message.slice(1));
  } else {
    processMessage(message.toLowerCase());
  }
}

function handleCommand(command) {
  switch (command) {
    case "skills":
      const skillsMsg = formatSkills(botInfo.skills);
      sendBotMessage(skillsMsg);
      break;
    case "projects":
      const template = document.getElementById("project-cards-template");
      const cards = template.content.cloneNode(true);
      sendBotMessage("🚀 Here are some of my notable projects:", cards);
      attachProjectListeners();
      break;
    case "contact":
      const contactTemplate = document.getElementById(
        "contact-buttons-template"
      );
      const contactButtons = contactTemplate.content.cloneNode(true);
      sendBotMessage(
        "📱 Let's connect! Choose how you'd like to reach me:",
        contactButtons
      );
      attachContactListeners();
      break;
    case "location":
      showLocation();
      break;
    case "resume":
      sendBotMessage("📄 Initiating resume download...");
      downloadResume();
      break;
    case "clear":
      confirmClearChat();
      break;
    case "help":
      sendBotMessage(helpMessage);
      break;
    case "services":
      const servicesTemplate = document.getElementById("services-template");
      const services = servicesTemplate.content.cloneNode(true);
      sendBotMessage("💼 Here are the services I offer:", services);
      attachServiceListeners();
      break;
    default:
      sendBotMessage(
        "❓ Unknown command. Type /help to see available commands."
      );
  }
}

// Add this new function for resume download
function downloadResume() {
  fetch(botInfo.resume)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Resume not found");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Octavian_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      sendBotMessage("✅ Resume downloaded successfully!");
    })
    .catch((error) => {
      console.error("Download failed:", error);
      sendBotMessage(
        "❌ Sorry, there was an error downloading the resume. Please try again later."
      );
    });
}

// Replace the showLocation function
function showLocation() {
  const template = document.getElementById("location-template");
  const locationCard = template.content.cloneNode(true);

  // Send the initial message with location card
  sendBotMessage(
    `📍 I'm based in <strong>${botInfo.location}</strong>`,
    locationCard
  );

  // Try to initialize the map
  try {
    setTimeout(() => {
      const mapElement = document.querySelector(".map-container");
      if (!mapElement) return;

      // Map styling for better integration with the chat interface
      const mapOptions = {
        center: LOCATION_COORDS,
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      };

      // Create the map
      map = new google.maps.Map(mapElement, mapOptions);

      // Add marker
      const marker = new google.maps.Marker({
        position: LOCATION_COORDS,
        map: map,
        title: botInfo.location,
        animation: google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color: black; padding: 5px;">
                  <strong>${botInfo.location}</strong><br>
                  Click to get directions
              </div>`,
      });

      // Add click listener to marker
      marker.addListener("click", () => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${LOCATION_COORDS.lat},${LOCATION_COORDS.lng}`
        );
      });

      // Show info window on marker hover
      marker.addListener("mouseover", () => {
        infoWindow.open(map, marker);
      });
      marker.addListener("mouseout", () => {
        infoWindow.close();
      });

      // Update location text
      const locationText = document.querySelector(
        ".location-details .location-text"
      );
      if (locationText) {
        locationText.textContent = botInfo.location;
      }
    }, 500); // Give DOM time to update
  } catch (error) {
    console.error("Error loading map:", error);
    // Fallback message if map fails to load
    sendBotMessage(`📍 I'm located in ${botInfo.location}. 
      
<a href="https://www.google.com/maps/search/?api=1&query=${LOCATION_COORDS.lat},${LOCATION_COORDS.lng}" target="_blank">View on Google Maps</a>`);
  }
}

function confirmClearChat() {
  awaitingClearConfirmation = true;
  sendBotMessage(`⚠️ Are you sure you want to clear the chat history? 

Type "yes" to confirm or "no" to cancel.`);
}

function processMessage(message) {
  if (message.includes("hello") || message.includes("hi")) {
    sendBotMessage("👋 Hi there! How can I help you today?");
  } else if (message.includes("hire") || message.includes("job")) {
    sendBotMessage(`🎯 <strong>I'm currently open to job opportunities!</strong>

I'd love to discuss how I can contribute to your team.

Available information:
• /skills - See my <strong>technical expertise</strong>
• /projects - View my <strong>portfolio</strong>
• /resume - Get my <strong>CV</strong>
• /contact - <strong>Reach out</strong> to me`);
  } else {
    sendBotMessage(
      "I'm not sure how to respond to that. Type <strong>/help</strong> to see what I can do!"
    );
  }
}

// Utility Functions
function formatSkills(skills) {
  return `🎯 My Skills:

💻 Programming: ${skills.programming.join(", ")}
🌐 Web Technologies: ${skills.web.join(", ")}
🗄️ Databases: ${skills.database.join(", ")}
🛠️ Tools & Platforms: ${skills.tools.join(", ")}
🤝 Soft Skills: ${skills.soft.join(", ")}`;
}

let currentProjectIndex = 0;

function attachProjectListeners() {
  // Add small delay to ensure DOM is ready
  setTimeout(() => {
    const bentoCard = document.querySelector(".bento-card");
    if (!bentoCard) return;

    let currentIndex = 0;

    function updateProject(index) {
      const project = botInfo.projects[index + 1];
      if (!project) return;

      // Create and preload image
      const img = new Image();
      img.onload = () => {
        const imageEl = bentoCard.querySelector(".bento-image");
        imageEl.src = img.src;
        imageEl.classList.remove("error");
      };
      img.onerror = () => {
        const imageEl = bentoCard.querySelector(".bento-image");
        imageEl.src =
          "https://placehold.co/800x400/2481cc/ffffff?text=Project+Preview";
        imageEl.classList.add("error");
      };
      img.src = project.image;

      // Update text content immediately
      bentoCard.querySelector(".bento-title").textContent = project.name;
      bentoCard.querySelector(".bento-description").textContent =
        project.description;
      bentoCard.querySelector(".bento-tech").textContent = project.tech;
      bentoCard.querySelector(".project-counter").textContent = `Project ${
        index + 1
      } of 5`;

      // Update navigation buttons
      const prevBtn = bentoCard.querySelector(".prev-btn");
      const nextBtn = bentoCard.querySelector(".next-btn");
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === 4;
    }

    // Initialize first project immediately
    updateProject(currentIndex);

    // Set up navigation with direct event binding
    const prevBtn = bentoCard.querySelector(".prev-btn");
    const nextBtn = bentoCard.querySelector(".next-btn");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateProject(currentIndex);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentIndex < 4) {
          currentIndex++;
          updateProject(currentIndex);
        }
      };
    }

    // Action buttons
    const previewBtn = bentoCard.querySelector(
      '[data-project-action="preview"]'
    );
    const codeBtn = bentoCard.querySelector('[data-project-action="code"]');

    if (previewBtn) {
      previewBtn.onclick = () => {
        const project = botInfo.projects[currentIndex + 1];
        window.open(project.preview, "_blank");
      };
    }

    if (codeBtn) {
      codeBtn.onclick = () => {
        const project = botInfo.projects[currentIndex + 1];
        window.open(project.code, "_blank");
      };
    }

    // View all projects button
    const viewAllBtn = document.querySelector(".view-all-projects");
    if (viewAllBtn) {
      viewAllBtn.onclick = () => {
        window.open(botInfo.githubProfile, "_blank");
        sendBotMessage("🌟 Feel free to explore all my projects on GitHub!");
      };
    }
  }, 100); // Small delay to ensure DOM is ready
}

function attachContactListeners() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const contact = botInfo.contacts[action];

      switch (action) {
        case "email":
          window.location.href = `mailto:${contact}?subject=Getting%20in%20touch&body=Hi%20Octavian,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.`;
          sendBotMessage(
            `📧 Opening email client to contact me at: ${contact}`
          );
          break;

        case "whatsapp":
          window.open(
            `https://wa.me/${contact.replace(
              /\+/g,
              ""
            )}?text=Hi%20Octavian,%20I%20found%20your%20portfolio!`,
            "_blank"
          );
          sendBotMessage(`💬 Opening WhatsApp to chat with me: ${contact}`);
          break;

        case "phone":
          window.location.href = `tel:${contact}`;
          sendBotMessage(`📞 Initiating call to: ${contact}`);
          break;

        case "linkedin":
        case "twitter":
        case "github":
          window.open(contact, "_blank");
          sendBotMessage(
            `🔗 Opening my ${
              action.charAt(0).toUpperCase() + action.slice(1)
            } profile...`
          );
          break;
      }
    });
  });
}

// Add new function for message selection handling
function handleMessageSelection(messageElement) {
  if (messageElement.classList.contains("selected-message")) {
    messageElement.classList.remove("selected-message");
    selectedMessages = selectedMessages.filter((msg) => msg !== messageElement);
  } else {
    messageElement.classList.add("selected-message");
    selectedMessages.push(messageElement);
  }

  // Show/hide delete button based on selection
  const deleteButton = document.getElementById("delete-selected");
  if (selectedMessages.length > 0) {
    if (!deleteButton) {
      const btn = document.createElement("button");
      btn.id = "delete-selected";
      btn.className = "delete-button";
      btn.innerHTML = `<i class="fas fa-trash"></i> Delete (${selectedMessages.length})`;
      btn.onclick = deleteSelectedMessages;
      document.querySelector(".chat-header").appendChild(btn);
    } else {
      deleteButton.innerHTML = `<i class="fas fa-trash"></i> Delete (${selectedMessages.length})`;
    }
  } else if (deleteButton) {
    deleteButton.remove();
  }
}

function deleteSelectedMessages() {
  selectedMessages.forEach((message) => {
    message.remove();
  });
  selectedMessages = [];
  document.getElementById("delete-selected")?.remove();
}

function addUserMessage(text) {
  // Save message to server
  saveMessageToServer({
    content: text,
    type: "user",
    timestamp: new Date(),
  });

  const template = document.getElementById("user-message-template");
  const message = template.content.cloneNode(true);
  const messageElement = message.querySelector(".message");

  messageElement.addEventListener("click", (e) => {
    if (e.shiftKey) {
      handleMessageSelection(messageElement);
    }
  });

  messageElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    handleMessageSelection(messageElement);
  });

  message.querySelector(".message-text").textContent = text;
  message.querySelector(".timestamp").textContent = getCurrentTime();
  chatArea.appendChild(message);
  scrollToBottom();
}

// Add these utility functions
function showTypingIndicator() {
  const template = document.getElementById("typing-indicator-template");
  const indicator = template.content.cloneNode(true);
  chatArea.appendChild(indicator);
  scrollToBottom();

  // Update status to "typing..."
  statusIndicator.classList.add("typing");
  statusIndicator.textContent = "";
}

function hideTypingIndicator() {
  const indicator = document.querySelector(".typing-indicator");
  if (indicator) {
    indicator.remove();
  }
  // Reset status to "online"
  statusIndicator.classList.remove("typing");
  statusIndicator.textContent = "online";
}

// Update the sendBotMessage function to save messages
function sendBotMessage(text, extraContent = null) {
  showTypingIndicator();
  const delay = Math.min(Math.max(text.length * 30, 1000), 3000);

  setTimeout(async () => {
    hideTypingIndicator();

    // Save message to server
    await saveMessageToServer({
      content: text,
      type: "bot",
      timestamp: new Date(),
    });

    const template = document.getElementById("bot-message-template");
    const message = template.content.cloneNode(true);
    const messageElement = message.querySelector(".message");

    messageElement.addEventListener("click", (e) => {
      if (e.shiftKey) {
        handleMessageSelection(messageElement);
      }
    });

    messageElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      handleMessageSelection(messageElement);
    });

    message.querySelector(".message-text").innerHTML = text; // Changed from textContent to innerHTML
    message.querySelector(".timestamp").textContent = getCurrentTime();

    if (extraContent) {
      message.querySelector(".message-content").appendChild(extraContent);
    }

    chatArea.appendChild(message);
    scrollToBottom();
  }, delay);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Add service slider functionality
function attachServiceListeners() {
  setTimeout(() => {
    const serviceCard = document.querySelector(".service-card");
    if (!serviceCard) return;

    let currentIndex = 0;

    function updateService(index) {
      const service = botInfo.services[index + 1];
      if (!service) return;

      const icon = serviceCard.querySelector(".service-icon");
      icon.className = `service-icon ${service.icon}`;

      serviceCard.querySelector(".service-title").textContent = service.title;
      serviceCard.querySelector(".service-description").textContent =
        service.description;
      serviceCard.querySelector(".price").textContent = service.price;
      serviceCard.querySelector(".duration").textContent = service.duration;
      serviceCard.querySelector(".service-counter").textContent = `Service ${
        index + 1
      } of 5`;

      const prevBtn = serviceCard.querySelector(".prev-btn");
      const nextBtn = serviceCard.querySelector(".next-btn");
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === 4;
    }

    // Initialize first service
    updateService(currentIndex);

    // Navigation
    const prevBtn = serviceCard.querySelector(".prev-btn");
    const nextBtn = serviceCard.querySelector(".next-btn");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateService(currentIndex);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentIndex < 4) {
          currentIndex++;
          updateService(currentIndex);
        }
      };
    }

    // Hire button
    const hireBtn = serviceCard.querySelector(".hire-btn");
    if (hireBtn) {
      hireBtn.onclick = () => {
        const service = botInfo.services[currentIndex + 1];
        handleCommand("contact");
        sendBotMessage(
          `💡 Interested in my ${service.title.toLowerCase()} service? Let's discuss your project!`
        );
      };
    }
  }, 100);
}
