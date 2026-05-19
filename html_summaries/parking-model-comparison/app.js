const tabs = document.getElementById("tabs");
const content = document.getElementById("content");
const SECTION_ORDER = [
  "overview",
  "modelblocks",
  "fullarch",
  "data",
  "inputs",
  "encoder",
  "outputs",
  "latent",
  "losses",
  "training",
  "config",
  "glossary",
  "critique",
];
const orderRank = (id) => {
  const rank = SECTION_ORDER.indexOf(id);
  return rank === -1 ? SECTION_ORDER.length : rank;
};
const sections = [...(window.REPORT_SECTIONS || [])].sort((a, b) => orderRank(a.id) - orderRank(b.id));
window.REPORT_AFTER_RENDER = window.REPORT_AFTER_RENDER || {};

for (const [index, section] of sections.entries()) {
  const button = document.createElement("button");
  button.className = "tab";
  button.innerHTML = `<span class="tab-index">${String(index + 1).padStart(2, "0")}</span><span>${section.title}</span>`;
  button.dataset.id = section.id;
  button.addEventListener("click", () => render(section.id));
  tabs.appendChild(button);
}

function render(id) {
  const section = sections.find((item) => item.id === id) ?? sections[0];
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.id === section.id);
  });
  content.innerHTML = `<section class="section"><h2>${section.title}</h2>${section.html}</section>`;
  history.replaceState(null, "", `#${section.id}`);
  window.REPORT_AFTER_RENDER[section.id]?.();
}

render(location.hash.slice(1) || "overview");
