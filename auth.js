const panels = document.querySelectorAll(".panel");
const tabs = document.querySelectorAll("[data-go]");
const nextBtn = document.getElementById("nextBtn");
const nextLabel = document.getElementById("nextLabel");
const backBtn = document.getElementById("backBtn");
const counter = document.getElementById("counter");
const dotsBox = document.getElementById("dots");
const stage = document.getElementById("stage");

const total = panels.length;
let current = 0;

// Build the progress dots (click one to jump)
const dots = [];
for (let i = 0; i < total; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", "Go to page " + (i + 1));
  dot.addEventListener("click", function () { show(i); });
  dotsBox.appendChild(dot);
  dots.push(dot);
}

// Show one page
function show(index) {
  if (index < 0 || index >= total) return;

  const goingBack = index < current;
  current = index;

  panels.forEach(function (panel, i) {
    panel.classList.remove("active", "back");
    if (i === current) {
      panel.classList.add("active");
      if (goingBack) panel.classList.add("back");
    }
  });

  tabs.forEach(function (tab) {
    tab.classList.toggle("active", Number(tab.dataset.go) === current && tab.closest("#tabs") !== null);
  });

  dots.forEach(function (dot, i) {
    dot.classList.toggle("current", i === current);
    dot.classList.toggle("done", i < current);
  });

  counter.textContent = (current + 1) + " / " + total;
  backBtn.disabled = current === 0;
  nextLabel.textContent = current === total - 1 ? "Start Over" : "Next";

  window.scrollTo({ top: 0, behavior: "smooth" });
  try { history.replaceState(null, "", "#page" + (current + 1)); } catch (e) {}
}

// Next goes forward, and restarts after the last page
nextBtn.addEventListener("click", function () {
  show(current === total - 1 ? 0 : current + 1);
});
backBtn.addEventListener("click", function () { show(current - 1); });

// Menu buttons
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () { show(Number(tab.dataset.go)); });
});

// Keyboard arrows
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") show(current + 1);
  if (e.key === "ArrowLeft") show(current - 1);
});

// Swipe on phones
let startX = 0;
stage.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; });
stage.addEventListener("touchend", function (e) {
  const diff = e.changedTouches[0].clientX - startX;
  if (diff < -60) show(current + 1);
  if (diff > 60) show(current - 1);
});

// Open on the page named in the link (e.g. profile.html#page3)
const start = parseInt((location.hash || "").replace("#page", ""), 10);
show(!isNaN(start) && start >= 1 && start <= total ? start - 1 : 0);