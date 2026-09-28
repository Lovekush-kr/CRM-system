const defaultCustomers = [
  { name: "Priya Nair", email: "priya.nair@brightway.com", phone: "555-0101", company: "Brightway Traders", status: "Active" },
  { name: "Daniel Okafor", email: "d.okafor@metrosupplies.com", phone: "555-0102", company: "Metro Supplies", status: "Active" },
  { name: "Sara Lindqvist", email: "sara@alderco.com", phone: "555-0103", company: "Alder & Co", status: "Inactive" },
  { name: "Miguel Torres", email: "mtorres@harborfoods.com", phone: "555-0104", company: "Harbor Foods", status: "Active" },
  { name: "Aisha Rahman", email: "aisha.rahman@kestrel.com", phone: "555-0105", company: "Kestrel Logistics", status: "Active" },
  { name: "Tom Becker", email: "tom@beckerhardware.com", phone: "555-0106", company: "Becker Hardware", status: "Inactive" },
  { name: "Neha Kapoor", email: "neha@greenleafcafe.com", phone: "555-0107", company: "Greenleaf Cafe", status: "Active" },
  { name: "Luis Fernandez", email: "luis@northpeak.com", phone: "555-0108", company: "Northpeak Outdoors", status: "Active" }
];

const defaultLeads = [
  { name: "Grace Whitfield", company: "Whitfield Print", contact: "grace@whitfieldprint.com", status: "New", followUp: "2026-10-02" },
  { name: "Omar Haddad", company: "Haddad Textiles", contact: "555-0201", status: "Contacted", followUp: "2026-10-01" },
  { name: "Emily Zhang", company: "Zhang Electronics", contact: "emily@zhangelec.com", status: "Converted", followUp: "2026-09-24" },
  { name: "Rahul Mehta", company: "Mehta Auto Parts", contact: "555-0203", status: "New", followUp: "2026-10-05" },
  { name: "Chloe Martin", company: "Martin & Sons", contact: "chloe@martinsons.com", status: "Contacted", followUp: "2026-10-03" },
  { name: "Ibrahim Yusuf", company: "Yusuf Furniture", contact: "555-0205", status: "Converted", followUp: "2026-09-20" }
];

const defaultTasks = [
  { id: 1, task: "Call Priya Nair about renewal", date: "2026-09-29", priority: "High", status: "Pending" },
  { id: 2, task: "Send quotation to Brightway Traders", date: "2026-09-30", priority: "Medium", status: "In Progress" },
  { id: 3, task: "Follow up with Metro Supplies", date: "2026-10-01", priority: "High", status: "Pending" },
  { id: 4, task: "Update customer records", date: "2026-10-02", priority: "Low", status: "Pending" },
  { id: 5, task: "Prepare monthly sales report", date: "2026-10-03", priority: "Medium", status: "In Progress" },
  { id: 6, task: "Schedule demo for Kestrel Logistics", date: "2026-10-05", priority: "Medium", status: "Pending" },
  { id: 7, task: "Confirm delivery with Harbor Foods", date: "2026-09-26", priority: "High", status: "Completed" },
  { id: 8, task: "Send welcome email to new customers", date: "2026-10-06", priority: "Low", status: "Pending" }
];

const activities = [
  { text: "Deal converted: Zhang Electronics", time: "Today" },
  { text: "Lead contacted: Omar Haddad", time: "Today" },
  { text: "Follow-up completed with Harbor Foods", time: "Yesterday" },
  { text: "New customer added: Luis Fernandez", time: "Yesterday" },
  { text: "Deal converted: Yusuf Furniture", time: "3 days ago" }
];

function load(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) && saved.length > 0 ? saved : fallback;
  } catch (error) {
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save to localStorage:", error);
  }
}

const customers = load("crm-customers", defaultCustomers);
const leads = load("crm-leads", defaultLeads);
const tasks = load("crm-tasks", defaultTasks);

const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const app = document.getElementById("app");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menu-toggle");
const navItems = document.querySelectorAll(".nav-item[data-section]");
const sections = document.querySelectorAll(".content section");

const customerBody = document.getElementById("customer-body");
const customerSearch = document.getElementById("customer-search");
const customerStatus = document.getElementById("customer-status");
const leadBody = document.getElementById("lead-body");
const leadSearch = document.getElementById("lead-search");
const leadStatus = document.getElementById("lead-status");
const taskBody = document.getElementById("task-body");

const badgeFields = ["status", "priority"];

/* ---------- Rendering ---------- */

function makeCell(value, isBadge) {
  const td = document.createElement("td");
  if (isBadge) {
    const badge = document.createElement("span");
    badge.className = "badge " + value.toLowerCase().replace(" ", "-");
    badge.textContent = value;
    td.appendChild(badge);
  } else {
    td.textContent = value;
  }
  return td;
}

function renderTable(tbody, items, fields, makeAction) {
  tbody.replaceChildren();
  if (items.length === 0) {
    const cell = tbody.insertRow().insertCell();
    cell.colSpan = fields.length + (makeAction ? 1 : 0);
    cell.className = "empty";
    cell.textContent = "No records found.";
    return;
  }
  items.forEach(function (item) {
    const row = tbody.insertRow();
    fields.forEach(function (field) {
      row.appendChild(makeCell(item[field], badgeFields.includes(field)));
    });
    if (makeAction) {
      row.appendChild(makeAction(item));
    }
  });
}

function matches(item, search, status) {
  const text = Object.values(item).join(" ").toLowerCase();
  return text.includes(search.trim().toLowerCase()) && (status === "all" || item.status === status);
}

function renderCustomers() {
  const list = customers.filter(function (c) {
    return matches(c, customerSearch.value, customerStatus.value);
  });
  renderTable(customerBody, list, ["name", "email", "phone", "company", "status"]);
}

function renderLeads() {
  const list = leads.filter(function (l) {
    return matches(l, leadSearch.value, leadStatus.value);
  });
  renderTable(leadBody, list, ["name", "company", "contact", "status", "followUp"]);
}

function renderTasks() {
  renderTable(taskBody, tasks, ["task", "date", "priority", "status"], function (task) {
    const td = document.createElement("td");
    if (task.status !== "Completed") {
      const button = document.createElement("button");
      button.className = "btn small";
      button.textContent = "Mark completed";
      button.dataset.id = task.id;
      td.appendChild(button);
    }
    return td;
  });
}

function renderDashboard() {
  document.getElementById("stat-customers").textContent = customers.length;
  document.getElementById("stat-leads").textContent = leads.length;
  document.getElementById("stat-sales").textContent = leads.filter(function (l) {
    return l.status === "Converted";
  }).length;
  document.getElementById("stat-tasks").textContent = tasks.filter(function (t) {
    return t.status !== "Completed";
  }).length;

  const list = document.getElementById("activity-list");
  list.replaceChildren();
  activities.slice(0, 6).forEach(function (activity) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    const time = document.createElement("time");
    text.textContent = activity.text;
    time.textContent = activity.time;
    li.append(text, time);
    list.appendChild(li);
  });
}

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderLeads();
  renderTasks();
}

/* ---------- Navigation and login ---------- */

function showSection(id) {
  sections.forEach(function (section) {
    section.hidden = section.id !== id;
  });
  navItems.forEach(function (item) {
    item.classList.toggle("active", item.dataset.section === id);
  });
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

navItems.forEach(function (item) {
  item.addEventListener("click", function () {
    showSection(item.dataset.section);
  });
});

menuToggle.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    loginError.textContent = "Enter both email and password.";
  } else if (email !== "admin@crm.com" || password !== "admin123") {
    loginError.textContent = "Incorrect email or password.";
  } else {
    loginError.textContent = "";
    loginForm.reset();
    loginScreen.hidden = true;
    app.hidden = false;
    showSection("dashboard");
  }
});

document.getElementById("logout-btn").addEventListener("click", function () {
  app.hidden = true;
  loginScreen.hidden = false;
});

/* ---------- Search and filters ---------- */

customerSearch.addEventListener("input", renderCustomers);
customerStatus.addEventListener("change", renderCustomers);
leadSearch.addEventListener("input", renderLeads);
leadStatus.addEventListener("change", renderLeads);

/* ---------- Add customer / lead ---------- */

function addActivity(text) {
  activities.unshift({ text: text, time: "Just now" });
}

function setupAddForm(dialogId, openButtonId, list, storageKey, describe) {
  const dialog = document.getElementById(dialogId);
  const form = dialog.querySelector("form");
  const error = form.querySelector(".form-error");

  document.getElementById(openButtonId).addEventListener("click", function () {
    form.reset();
    error.textContent = "";
    dialog.showModal();
  });

  dialog.querySelector("[data-close]").addEventListener("click", function () {
    dialog.close();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(
      Array.from(new FormData(form), function ([key, value]) {
        return [key, value.trim()];
      })
    );

    if (Object.values(data).some(function (value) { return value === ""; })) {
      error.textContent = "Please fill in all fields.";
      return;
    }

    list.unshift(data);
    save(storageKey, list);
    addActivity(describe(data));
    renderAll();
    dialog.close();
  });
}

setupAddForm("customer-dialog", "add-customer-btn", customers, "crm-customers", function (c) {
  return "New customer added: " + c.name;
});

setupAddForm("lead-dialog", "add-lead-btn", leads, "crm-leads", function (l) {
  return "New lead added: " + l.name;
});

/* ---------- Tasks ---------- */

taskBody.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  if (!button) return;

  const task = tasks.find(function (t) {
    return t.id === Number(button.dataset.id);
  });
  task.status = "Completed";
  save("crm-tasks", tasks);
  addActivity("Follow-up completed: " + task.task);
  renderAll();
});

renderAll();