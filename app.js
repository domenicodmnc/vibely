const profileView = document.querySelector("#profileView");
const moodEntryView = document.querySelector("#moodEntryView");
const builderView = document.querySelector("#builderView");
const homeView = document.querySelector("#homeView");
const profileGreeting = document.querySelector("#profileGreeting");
const rankingRow = document.querySelector("#rankingRow");
const posterGrid = document.querySelector("#posterGrid");
const searchInput = document.querySelector("#searchInput");
const recommendationFeed = document.querySelector("#recommendationFeed");
const activityFeed = document.querySelector("#activityFeed");
const viberList = document.querySelector("#viberList");
const viberCount = document.querySelector("#viberCount");
const ratingNotification = document.querySelector("#ratingNotification");
const ratingTitle = document.querySelector("#ratingTitle");
const starPicker = document.querySelector("#starPicker");
const phoneMoodPicker = document.querySelector("#phoneMoodPicker");
const phoneViberPicker = document.querySelector("#phoneViberPicker");
const recommendationNote = document.querySelector("#recommendationNote");
const entryMoodPicker = document.querySelector("#entryMoodPicker");
const tvRatingOverlay = document.querySelector("#tvRatingOverlay");
const tvRatingTitle = document.querySelector("#tvRatingTitle");
const tvStarPicker = document.querySelector("#tvStarPicker");
const tvMoodPicker = document.querySelector("#tvMoodPicker");
const tvViberPicker = document.querySelector("#tvViberPicker");
const builderName = document.querySelector("#builderName");
const builderForm = document.querySelector("#builderForm");
const trustBuilderList = document.querySelector("#trustBuilderList");
const recommendationMode = document.querySelector("#recommendationMode");
const previewAvatar = document.querySelector("#previewAvatar");
const previewName = document.querySelector("#previewName");
const previewSummary = document.querySelector("#previewSummary");
const communitySection = document.querySelector("#communitySection");
const appToast = document.querySelector("#appToast");
const srStatus = document.querySelector("#srStatus");

let activeFilter = "all";
let activeMood = "all";
let query = "";
let currentProfile = "Filippo";
let pendingProfile = "Filippo";
let activeTitle = "After Midnight";
let pendingTitle = "After Midnight";
let selectedRating = 4;
let selectedMoods = ["deep"];
let sessionMoods = [];
let selectedViberName = "Elisa";
let activeRatingSurface = "phone";
let builderReturnView = "profiles";
let toastTimer;
let lastDialogTrigger = null;
let lastBuilderTrigger = null;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

const storageKey = "vibely-mvp-community-v1";
const profileStorageKey = "vibely-mvp-viber-profile-v1";
const maxMoodSelection = 3;
const moodOptions = [
  { id: "chill", label: "Chill", example: "Weekend leggero", color: "linear-gradient(135deg, #143b4a, #2f8f9d)" },
  { id: "comfort", label: "Comfort", example: "Caldo e sicuro", color: "linear-gradient(135deg, #5a3518, #d6a23f)" },
  { id: "deep", label: "Deep", example: "Lento ma intenso", color: "linear-gradient(135deg, #171b3f, #6d5dfc)" },
  { id: "dark", label: "Dark", example: "Teso e notturno", color: "linear-gradient(135deg, #130b10, #9f1838)" },
  { id: "adrenaline", label: "Adrenalina", example: "Partita o action", color: "linear-gradient(135deg, #421212, #e50914)" },
  { id: "romantic", label: "Romantico", example: "Connessioni morbide", color: "linear-gradient(135deg, #3d1635, #cf6fb3)" },
  { id: "mindblown", label: "Mind-blown", example: "Sci-fi e twist", color: "linear-gradient(135deg, #111b3c, #4f7cff)" },
  { id: "nostalgic", label: "Nostalgico", example: "Ritorni e memoria", color: "linear-gradient(135deg, #3a2318, #c86f3d)" }
];
const moodIds = moodOptions.map((mood) => mood.id);

const vibers = [
  { name: "Elisa", initials: "EL", mood: "deep", trust: 96, relation: "Cinema nights", status: "online", color: "linear-gradient(135deg, #b79cff, #5b55ff)" },
  { name: "Serena", initials: "SE", mood: "chill", trust: 91, relation: "Stessi gusti", status: "online", color: "linear-gradient(135deg, #ffd36a, #f15bb5)" },
  { name: "Dario", initials: "DA", mood: "adrenaline", trust: 84, relation: "Sport e action", status: "away", color: "linear-gradient(135deg, #ff5c5c, #e50914)" },
  { name: "Carol", initials: "CA", mood: "chill", trust: 78, relation: "Scoperte leggere", status: "online", color: "linear-gradient(135deg, #62d6ff, #2f80ed)" }
];

let viberProfile = loadViberProfile();
applyViberProfile(viberProfile);

const items = [
  {
    title: "After Midnight",
    type: "series",
    label: "Serie thriller",
    mood: "dark",
    moods: ["dark", "deep"],
    gradient: "linear-gradient(135deg, #101010, #3a3a3a)",
    description: "Una serie notturna tra mistero, amicizie fragili e una citta piena di segreti."
  },
  {
    title: "Low Tide",
    type: "film",
    label: "Film drama",
    mood: "nostalgic",
    moods: ["nostalgic", "chill"],
    gradient: "linear-gradient(135deg, #151515, #555555)",
    description: "Un ritorno al mare riapre vecchie promesse e scelte lasciate in sospeso."
  },
  {
    title: "Final Whistle",
    type: "sport",
    label: "Sport live",
    mood: "adrenaline",
    moods: ["adrenaline"],
    gradient: "linear-gradient(135deg, #181818, #666666)",
    description: "La rivalita piu accesa della stagione raccontata dentro e fuori dal campo."
  },
  {
    title: "Neon Kitchen",
    type: "series",
    label: "Docuserie",
    mood: "comfort",
    moods: ["comfort", "chill"],
    gradient: "linear-gradient(135deg, #1f1f1f, #606060)",
    description: "Chef emergenti, cucine minuscole e menu che cambiano quartiere dopo quartiere."
  },
  {
    title: "Orbit City",
    type: "film",
    label: "Sci-fi",
    mood: "mindblown",
    moods: ["mindblown", "deep"],
    gradient: "linear-gradient(135deg, #0f0f0f, #4a4a4a)",
    description: "Un ingegnere scopre che la citta orbitale in cui vive sta nascondendo un secondo sole."
  },
  {
    title: "Run Club",
    type: "series",
    label: "Reality",
    mood: "adrenaline",
    moods: ["adrenaline"],
    gradient: "linear-gradient(135deg, #141414, #505050)",
    description: "Cinque runner preparano una gara impossibile mentre provano a rimettere ordine nelle loro vite."
  },
  {
    title: "Soft Signal",
    type: "film",
    label: "Romance",
    mood: "romantic",
    moods: ["romantic", "chill"],
    gradient: "linear-gradient(135deg, #202020, #747474)",
    description: "Una radio indipendente diventa il punto d'incontro per due persone che non si sono mai viste."
  },
  {
    title: "Cargo 17",
    type: "series",
    label: "Action",
    mood: "adrenaline",
    moods: ["adrenaline", "dark"],
    gradient: "linear-gradient(135deg, #171717, #5f5f5f)",
    description: "Un equipaggio trasporta l'unico carico che nessuno dovrebbe mai aprire."
  },
  {
    title: "Glass House",
    type: "film",
    label: "Mystery",
    mood: "dark",
    moods: ["dark", "deep"],
    gradient: "linear-gradient(135deg, #101010, #626262)",
    description: "Una villa trasparente, una cena di famiglia e una verita che tutti vedono ma nessuno nomina."
  },
  {
    title: "Street Finals",
    type: "sport",
    label: "Sport",
    mood: "adrenaline",
    moods: ["adrenaline"],
    gradient: "linear-gradient(135deg, #181818, #686868)",
    description: "Talenti di strada competono in una finale urbana dove ogni azione pesa."
  },
  {
    title: "Quiet Room",
    type: "series",
    label: "Drama",
    mood: "deep",
    moods: ["deep"],
    gradient: "linear-gradient(135deg, #151515, #4f4f4f)",
    description: "In uno studio di terapia, ogni episodio svela un dettaglio che cambia tutta la storia."
  },
  {
    title: "Weekend Mode",
    type: "film",
    label: "Comedy",
    mood: "comfort",
    moods: ["comfort", "chill"],
    gradient: "linear-gradient(135deg, #1f1f1f, #4d4d4d)",
    description: "Tre amici provano a staccare da tutto, ma il fine settimana ha altri piani."
  }
];

const coverDetails = {
  "After Midnight": {
    code: "AM",
    kicker: "Night thriller",
    accent: "#d6d6d6",
    ink: "#f6f8ff",
    texture: "linear-gradient(150deg, rgba(255,255,255,0.18), transparent 34%), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 34px)"
  },
  "Low Tide": {
    code: "LT",
    kicker: "Coastal drama",
    accent: "#d6d6d6",
    ink: "#f7fffb",
    texture: "radial-gradient(circle at 24% 32%, rgba(255,255,255,0.24), transparent 18%), linear-gradient(0deg, rgba(7,26,32,0.66), transparent 58%)"
  },
  "Final Whistle": {
    code: "90",
    kicker: "Last minute",
    accent: "#d6d6d6",
    ink: "#fff8df",
    texture: "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 26px), radial-gradient(circle at 76% 24%, rgba(255,255,255,0.24), transparent 22%)"
  },
  "Neon Kitchen": {
    code: "NK",
    kicker: "Food stories",
    accent: "#d6d6d6",
    ink: "#fff3ee",
    texture: "radial-gradient(circle at 72% 20%, rgba(255,255,255,0.24), transparent 20%), repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 18px)"
  },
  "Orbit City": {
    code: "OC",
    kicker: "Sci-fi feature",
    accent: "#d6d6d6",
    ink: "#f3f6ff",
    texture: "radial-gradient(circle at 72% 30%, rgba(255,255,255,0.36), transparent 8%), radial-gradient(circle at 50% 54%, rgba(255,255,255,0.18), transparent 28%)"
  },
  "Run Club": {
    code: "RC",
    kicker: "Reality sprint",
    accent: "#d6d6d6",
    ink: "#fff5f7",
    texture: "linear-gradient(115deg, transparent 0 42%, rgba(255,255,255,0.16) 42% 46%, transparent 46%), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 30px)"
  },
  "Soft Signal": {
    code: "SS",
    kicker: "Romance",
    accent: "#d6d6d6",
    ink: "#fff8ff",
    texture: "radial-gradient(circle at 25% 26%, rgba(255,255,255,0.2), transparent 20%), linear-gradient(145deg, rgba(255,255,255,0.12), transparent 42%)"
  },
  "Cargo 17": {
    code: "17",
    kicker: "Action serial",
    accent: "#d6d6d6",
    ink: "#faffdf",
    texture: "repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 18px), linear-gradient(180deg, transparent, rgba(0,0,0,0.52))"
  },
  "Glass House": {
    code: "GH",
    kicker: "Mystery",
    accent: "#d6d6d6",
    ink: "#f5fbff",
    texture: "linear-gradient(125deg, rgba(255,255,255,0.22), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.13) 0 1px, transparent 1px 46px)"
  },
  "Street Finals": {
    code: "SF",
    kicker: "Urban sport",
    accent: "#d6d6d6",
    ink: "#fff7dd",
    texture: "radial-gradient(circle at 72% 30%, rgba(255,255,255,0.22), transparent 20%), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 22px)"
  },
  "Quiet Room": {
    code: "QR",
    kicker: "Drama series",
    accent: "#d6d6d6",
    ink: "#f4f7fb",
    texture: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent 42%), radial-gradient(circle at 76% 18%, rgba(255,255,255,0.18), transparent 22%)"
  },
  "Weekend Mode": {
    code: "WM",
    kicker: "Comedy",
    accent: "#d6d6d6",
    ink: "#f5fffb",
    texture: "radial-gradient(circle at 20% 22%, rgba(255,255,255,0.2), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.16), transparent 34%)"
  }
};

const fallbackState = {
  recommendations: [
    {
      from: "Elisa",
      title: "Glass House",
      mood: "deep",
      kind: "recommend",
      note: "Te lo mando per quando vuoi qualcosa di teso ma elegante."
    },
    {
      from: "Serena",
      title: "Weekend Mode",
      mood: "chill",
      kind: "watch",
      note: "Lo guardiamo insieme dopo cena?"
    },
    {
      from: "Dario",
      title: "Street Finals",
      mood: "adrenaline",
      moods: ["adrenaline"],
      kind: "recommend",
      note: "Per il mood competitivo. Secondo me ti prende subito."
    }
  ],
  activities: [
    { actor: "Elisa", text: "ha consigliato Glass House a Filippo", mood: "deep" },
    { actor: "Serena", text: "ha proposto una visione condivisa di Weekend Mode", mood: "chill" },
    { actor: "Dario", text: "ha creato una catena di consigli adrenalina", mood: "adrenaline", moods: ["adrenaline"] }
  ],
  ratings: []
};

let communityState = loadState();

function loadViberProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(profileStorageKey));
    return saved || defaultViberProfile();
  } catch {
    return defaultViberProfile();
  }
}

function defaultViberProfile() {
  return {
    name: "Filippo",
    moods: ["deep", "chill"],
    genres: ["Thriller", "Drama"],
    mode: "Dopo ogni visione",
    trust: vibers.reduce((acc, viber) => {
      acc[viber.name] = viber.trust;
      return acc;
    }, {})
  };
}

function saveViberProfile() {
  localStorage.setItem(profileStorageKey, JSON.stringify(viberProfile));
}

function applyViberProfile(profile) {
  currentProfile = profile.name || currentProfile;
  vibers.forEach((viber) => {
    if (profile.trust && profile.trust[viber.name]) {
      viber.trust = Number(profile.trust[viber.name]);
    }
  });
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved || cloneFallbackState();
  } catch {
    return cloneFallbackState();
  }
}

function cloneFallbackState() {
  return JSON.parse(JSON.stringify(fallbackState));
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(communityState));
}

function getItem(title) {
  return items.find((item) => item.title === title) || items[0];
}

function normaliseMoodId(mood) {
  if (mood === "energy") return "adrenaline";
  return moodIds.includes(mood) ? mood : "chill";
}

function normaliseMoodList(value) {
  const list = Array.isArray(value) ? value : [value].filter(Boolean);
  const unique = [];
  list.forEach((mood) => {
    const id = normaliseMoodId(mood);
    if (!unique.includes(id)) unique.push(id);
  });
  return unique.slice(0, maxMoodSelection);
}

function getMoodOption(id) {
  return moodOptions.find((mood) => mood.id === normaliseMoodId(id)) || moodOptions[0];
}

function moodLabel(id) {
  return getMoodOption(id).label;
}

function moodLabelList(value) {
  return normaliseMoodList(value).map(moodLabel).join(", ");
}

function getMoodIds(source) {
  return normaliseMoodList(source.moods || source.mood || "chill");
}

function getItemMoods(item) {
  return getMoodIds(item);
}

function moodTagsTemplate(value) {
  return normaliseMoodList(value).map((mood) => `<span class="tag">${moodLabel(mood)}</span>`).join("");
}

function coverSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCoverDetails(item) {
  return coverDetails[item.title] || {
    code: item.title.slice(0, 2).toUpperCase(),
    kicker: item.label,
    accent: "#d6d6d6",
    ink: "#f5f7fb",
    texture: "linear-gradient(135deg, rgba(255,255,255,0.14), transparent 36%)"
  };
}

function posterPath(item) {
  return `./assets/posters/${coverSlug(item.title)}.jpg`;
}

function coverStyle(item) {
  const cover = getCoverDetails(item);
  return `--poster-bg: ${item.gradient}; --cover-accent: ${cover.accent}; --cover-ink: ${cover.ink};`;
}

function coverArtTemplate(item, variant = "") {
  const variantClass = variant ? ` ${variant}` : "";
  return `
    <span class="cover-art cover-${coverSlug(item.title)}${variantClass}" style="${coverStyle(item)}">
      <img class="cover-image" src="${posterPath(item)}" alt="Locandina fittizia di ${item.title}" loading="lazy" />
    </span>
  `;
}

function renderCover(container, item, variant = "") {
  container.innerHTML = coverArtTemplate(item, variant);
}

function getViber(name) {
  return vibers.find((viber) => viber.name === name) || vibers[0];
}

function getTrustedRecommendations() {
  return [...communityState.recommendations].sort((a, b) => recommendationStrength(b) - recommendationStrength(a));
}

function getActivityApprovalNames(activity) {
  return Array.isArray(activity.approvedBy) ? activity.approvedBy : [];
}

function getActivityApprovalCount(activity) {
  return Math.max(Number(activity.boosts || 0), getActivityApprovalNames(activity).length);
}

function recommendationStrength(recommendation) {
  const relatedApprovals = communityState.activities
    .filter((activity) => activity.actor === recommendation.from && activity.text.includes(recommendation.title))
    .reduce((sum, activity) => sum + getActivityApprovalCount(activity), 0);
  return getViber(recommendation.from).trust + relatedApprovals * 4;
}

function trustCopy(trust) {
  if (trust >= 90) return "Fiducia altissima";
  if (trust >= 82) return "Fiducia alta";
  return "Fiducia buona";
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "VI";
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  appToast.textContent = message;
  srStatus.textContent = "";
  window.setTimeout(() => {
    srStatus.textContent = message;
  }, 20);
  appToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    appToast.classList.remove("is-visible");
  }, 2400);
}

function setBottomNavActive(target) {
  document.querySelectorAll("[data-bottom-nav]").forEach((item) => {
    const active = item.dataset.bottomNav === target;
    item.classList.toggle("is-active", active);
    if (item.tagName === "BUTTON") {
      item.setAttribute("aria-pressed", String(active));
      item.removeAttribute("aria-current");
    } else if (active) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function scrollHomeToTop() {
  setBottomNavActive("home");
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function scrollToCommunity() {
  setBottomNavActive("community");
  communitySection.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFocusable(container) {
  return [...container.querySelectorAll(focusableSelector)]
    .filter((element) => element.offsetParent !== null && !element.getAttribute("aria-hidden"));
}

function focusFirst(container, preferredSelector) {
  const preferred = preferredSelector ? container.querySelector(preferredSelector) : null;
  const target = preferred || getFocusable(container)[0] || container;
  window.setTimeout(() => target.focus({ preventScroll: true }), 0);
}

function restoreDialogFocus() {
  if (lastDialogTrigger && document.contains(lastDialogTrigger) && !lastDialogTrigger.closest("[aria-hidden='true']")) {
    lastDialogTrigger.focus({ preventScroll: true });
    lastDialogTrigger = null;
    return;
  }

  const fallback = document.querySelector(`[data-share-title="${pendingTitle}"]`)
    || document.querySelector(`[data-title="${pendingTitle}"]`)
    || document.querySelector("#heroPlayButton");
  fallback?.focus({ preventScroll: true });
  lastDialogTrigger = null;
}

function openDialog(dialog, preferredSelector) {
  lastDialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.removeAttribute("inert");
  dialog.classList.add("is-open");
  dialog.setAttribute("aria-hidden", "false");
  focusFirst(dialog, preferredSelector);
}

function closeDialog(dialog, restoreFocus = true) {
  dialog.classList.remove("is-open");
  dialog.setAttribute("aria-hidden", "true");
  dialog.setAttribute("inert", "");
  if (restoreFocus) restoreDialogFocus();
}

function activeDialog() {
  if (ratingNotification.classList.contains("is-open")) return ratingNotification;
  if (tvRatingOverlay.classList.contains("is-open")) return tvRatingOverlay;
  return null;
}

function keepFocusInDialog(event) {
  const dialog = activeDialog();
  if (!dialog) return;

  if (event.key === "Escape") {
    event.preventDefault();
    if (dialog === ratingNotification) closeRating();
    if (dialog === tvRatingOverlay) closeTvRating();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusable(dialog);
  if (!focusable.length) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openMoodEntry(profile) {
  pendingProfile = profile;
  selectedMoods = normaliseMoodList(viberProfile.moods).slice(0, maxMoodSelection);
  profileView.classList.add("hidden");
  moodEntryView.classList.remove("hidden");
  builderView.classList.add("hidden");
  homeView.classList.add("hidden");
  renderEntryMoodPicker();
  focusFirst(moodEntryView, "[data-entry-mood]");
}

function enterHome(profile, moods = []) {
  sessionMoods = normaliseMoodList(moods);
  openHome(profile);
}

function openHome(profile) {
  currentProfile = profile;
  profileGreeting.textContent = profile;
  profileView.classList.add("hidden");
  moodEntryView.classList.add("hidden");
  builderView.classList.add("hidden");
  homeView.classList.remove("hidden");
  setBottomNavActive("home");
  render();
  focusFirst(homeView, "#heroPlayButton");
}

function backToProfiles() {
  homeView.classList.add("hidden");
  builderView.classList.add("hidden");
  moodEntryView.classList.add("hidden");
  profileView.classList.remove("hidden");
  closeRating(false);
  closeTvRating(false);
  focusFirst(profileView, ".profile-card[data-profile]");
}

function openBuilder(returnView) {
  lastBuilderTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  builderReturnView = returnView;
  profileView.classList.add("hidden");
  moodEntryView.classList.add("hidden");
  homeView.classList.add("hidden");
  builderView.classList.remove("hidden");
  renderBuilder();
  focusFirst(builderView, "#builderName");
}

function closeBuilderView() {
  builderView.classList.add("hidden");
  if (builderReturnView === "home") {
    homeView.classList.remove("hidden");
    setBottomNavActive("home");
    render();
  } else {
    profileView.classList.remove("hidden");
  }
  if (lastBuilderTrigger && document.contains(lastBuilderTrigger)) {
    lastBuilderTrigger.focus({ preventScroll: true });
  } else {
    focusFirst(builderReturnView === "home" ? homeView : profileView, builderReturnView === "home" ? "[data-bottom-nav='profile']" : ".profile-card[data-profile]");
  }
  lastBuilderTrigger = null;
}

function render() {
  renderCatalog();
  renderCommunity();
}

function renderEntryMoodPicker() {
  entryMoodPicker.innerHTML = moodOptions.map((mood) => {
    const selected = selectedMoods.includes(mood.id) ? " is-selected" : "";
    const pressed = selectedMoods.includes(mood.id);
    return `
      <button class="mood-card${selected}" data-entry-mood="${mood.id}" type="button" style="--mood-bg: ${mood.color}" aria-pressed="${pressed}" aria-label="${mood.label}: ${mood.example}${pressed ? ", selezionato" : ""}">
        <strong>${mood.label}</strong>
        <span>${mood.example}</span>
      </button>
    `;
  }).join("");

  document.querySelectorAll("[data-entry-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.entryMood;
      toggleMoodSelection(mood, () => {
        renderEntryMoodPicker();
        entryMoodPicker.querySelector(`[data-entry-mood="${mood}"]`)?.focus({ preventScroll: true });
      });
    });
  });
}

function renderBuilder() {
  builderName.value = viberProfile.name || currentProfile;
  recommendationMode.value = viberProfile.mode || "Dopo ogni visione";
  document.querySelectorAll("[data-builder-mood]").forEach((button) => {
    const selected = normaliseMoodList(viberProfile.moods).includes(button.dataset.builderMood);
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll("[data-builder-genre]").forEach((button) => {
    const selected = viberProfile.genres.includes(button.dataset.builderGenre);
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  trustBuilderList.innerHTML = [...vibers]
    .sort((a, b) => b.trust - a.trust)
    .map((viber) => `
      <label class="trust-row">
        <span class="viber-avatar" style="--viber-bg: ${viber.color}">${viber.initials}</span>
        <span>
          <strong>${viber.name}</strong>
          <p>${viber.relation}</p>
        </span>
        <input data-trust-viber="${viber.name}" type="range" min="0" max="100" value="${viber.trust}" aria-label="Fiducia verso ${viber.name}" />
        <span class="trust-value">${viber.trust}%</span>
      </label>
    `).join("");

  document.querySelectorAll("[data-trust-viber]").forEach((input) => {
    input.addEventListener("input", () => {
      const name = input.dataset.trustViber;
      const value = Number(input.value);
      const viber = getViber(name);
      viber.trust = value;
      viberProfile.trust[name] = value;
      input.closest(".trust-row").querySelector(".trust-value").textContent = `${value}%`;
      updateBuilderPreview();
    });
  });

  updateBuilderPreview();
}

function updateBuilderPreview() {
  const name = builderName.value.trim() || "Nuovo Viber";
  const topMood = moodLabel(normaliseMoodList(viberProfile.moods)[0] || "chill");
  const topGenre = viberProfile.genres[0] || "generi";
  const averageTrust = Math.round(vibers.reduce((sum, viber) => sum + viber.trust, 0) / vibers.length);
  previewAvatar.textContent = initials(name);
  previewName.textContent = name;
  previewSummary.textContent = `${topMood} · ${topGenre} · fiducia media ${averageTrust}%`;
}

function toggleMoodSelection(mood, renderAgain) {
  const id = normaliseMoodId(mood);
  if (selectedMoods.includes(id)) {
    selectedMoods = selectedMoods.filter((item) => item !== id);
  } else if (selectedMoods.length >= maxMoodSelection) {
    showToast("Puoi scegliere massimo 3 mood.");
    return;
  } else {
    selectedMoods = [...selectedMoods, id];
  }
  renderAgain();
}

function renderCatalog() {
  const visible = items.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesMood = activeMood === "all" || getItemMoods(item).includes(activeMood);
    const matchesQuery = item.title.toLowerCase().includes(query) || item.label.toLowerCase().includes(query);
    return matchesFilter && matchesMood && matchesQuery;
  });

  rankingRow.innerHTML = items.slice(0, 10).map((item, index) => rankTemplate(item, index + 1)).join("");
  posterGrid.innerHTML = visible.length
    ? visible.map(posterTemplate).join("")
    : emptyStateTemplate("Nessun contenuto trovato", "Prova un altro mood, categoria o termine di ricerca.");

  document.querySelectorAll("[data-title]").forEach((button) => {
    button.addEventListener("click", () => openPlayer(button.dataset.title));
  });
}

function renderCommunity() {
  const trustedVibers = [...vibers].sort((a, b) => b.trust - a.trust);
  const trustedRecommendations = getTrustedRecommendations();

  viberCount.textContent = `${vibers.length} fidati`;
  viberList.innerHTML = trustedVibers.length
    ? trustedVibers.map(viberTemplate).join("")
    : emptyStateTemplate("Nessun Viber", "Aggiungi persone fidate dal profilo.");
  recommendationFeed.innerHTML = trustedRecommendations.length
    ? trustedRecommendations.slice(0, 5).map(recommendationTemplate).join("")
    : emptyStateTemplate("Nessun consiglio", "Quando un Viber ti consiglia qualcosa, lo trovi qui.");
  activityFeed.innerHTML = communityState.activities.length
    ? communityState.activities.slice(0, 6).map(activityTemplate).join("")
    : emptyStateTemplate("Nessuna attivita", "Rating, consigli e approvazioni appariranno in questa riga.");

  document.querySelectorAll("[data-watch-title]").forEach((button) => {
    button.addEventListener("click", () => openPlayer(button.dataset.watchTitle));
  });

  document.querySelectorAll("[data-share-title]").forEach((button) => {
    button.addEventListener("click", () => openRating(button.dataset.shareTitle));
  });

  document.querySelectorAll("[data-approve-activity]").forEach((button) => {
    button.addEventListener("click", () => approveActivity(Number(button.dataset.approveActivity)));
  });
}

function rankTemplate(item, rank) {
  return `
    <button class="rank-card" data-title="${item.title}" type="button" aria-label="Apri ${item.title}, ${item.label}, posizione ${rank} nella Top 10">
      ${coverArtTemplate(item, "rank-cover")}
      <span class="rank-number">${rank}</span>
      <span class="rank-body">
        <strong>${item.title}</strong>
        <span>${item.label}</span>
      </span>
    </button>
  `;
}

function posterTemplate(item) {
  return `
    <button class="poster-card" data-title="${item.title}" type="button" aria-label="Apri ${item.title}, ${item.label}, mood ${moodLabelList(getItemMoods(item))}">
      ${coverArtTemplate(item, "poster-cover")}
      <span class="poster-body">
        <strong>${item.title}</strong>
        <span>${item.label}</span>
        <span class="tag-row">
          ${moodTagsTemplate(getItemMoods(item))}
          <span class="tag">${item.type}</span>
        </span>
      </span>
    </button>
  `;
}

function recommendationTemplate(recommendation) {
  const item = getItem(recommendation.title);
  const viber = getViber(recommendation.from);
  const actionCopy = recommendation.kind === "watch" ? "Vuole guardarlo con te" : "Consiglio per te";
  const noteCopy = compactRecommendationNote(recommendation.note, item, viber);
  return `
    <article class="recommendation-card">
      <div class="recommendation-art">${coverArtTemplate(item, "recommendation-cover")}</div>
      <div class="recommendation-body">
        <div class="trust-line">
          <span class="trust-person">
            <span class="viber-avatar tiny-avatar" style="--viber-bg: ${viber.color}">${viber.initials}</span>
            <p class="eyebrow">${recommendation.from}</p>
          </span>
          <span>${viber.trust}% fiducia</span>
        </div>
        <h3>${item.title}</h3>
        <p>${actionCopy}: ${noteCopy}</p>
        <div class="recommendation-meta">
          ${moodTagsTemplate(getMoodIds(recommendation))}
          <span class="tag">${item.label}</span>
          <span class="tag">${viber.relation}</span>
        </div>
      </div>
      <div class="recommendation-actions">
        <button class="small-action is-primary" data-watch-title="${item.title}" type="button" aria-label="Guarda ${item.title}, consigliato da ${viber.name}">Guarda</button>
        <button class="small-action" data-share-title="${item.title}" type="button" aria-label="Apri feedback e ricambia il consiglio su ${item.title}">Ricambia</button>
      </div>
    </article>
  `;
}

function activityTemplate(activity, index) {
  const viber = getViber(activity.actor);
  const isViberActivity = vibers.some((entry) => entry.name === activity.actor);
  const approvalNames = getActivityApprovalNames(activity);
  const approvalCount = getActivityApprovalCount(activity);
  const isApproved = approvalNames.includes(currentProfile);
  const trustTag = isViberActivity ? `<span class="tag">fiducia ${viber.trust}%</span>` : "";
  const approvalTag = approvalCount > 0 ? `<span class="tag is-strong">rafforzato ${approvalCount}</span>` : "";
  const approveButton = isViberActivity
    ? `<button class="small-action activity-approve${isApproved ? " is-approved" : ""}" data-approve-activity="${index}" type="button" aria-pressed="${isApproved}" aria-label="${isApproved ? "Consiglio gia approvato" : `Approva il consiglio di ${activity.actor}`}">${isApproved ? "Approvato" : "Approva"}</button>`
    : "";
  return `
    <article class="activity-card${isApproved ? " is-approved" : ""}">
      <strong>${activity.actor}</strong>
      <p>${activity.text}</p>
      <div class="activity-meta">
        ${moodTagsTemplate(getMoodIds(activity))}
        ${trustTag}
        ${approvalTag}
      </div>
      ${approveButton ? `<div class="activity-actions">${approveButton}</div>` : ""}
    </article>
  `;
}

function viberTemplate(viber) {
  const statusClass = viber.status === "away" ? "status-dot is-away" : "status-dot";
  const statusCopy = viber.status === "away" ? "non disponibile" : "online";
  return `
    <article class="viber-card" aria-label="${viber.name}, ${viber.relation}, mood ${moodLabel(viber.mood)}, fiducia ${viber.trust}%, ${statusCopy}">
      <span class="viber-avatar" style="--viber-bg: ${viber.color}" aria-hidden="true">${viber.initials}</span>
      <span>
        <strong>${viber.name}</strong>
        <p>${viber.relation} · mood ${moodLabel(viber.mood)}</p>
        <span class="trust-meter"><span style="width: ${viber.trust}%"></span></span>
      </span>
      <span class="${statusClass}" title="${statusCopy}" aria-hidden="true"></span>
    </article>
  `;
}

function emptyStateTemplate(title, copy) {
  return `
    <div class="empty-state" role="status">
      <strong>${title}</strong>
      <span>${copy}</span>
    </div>
  `;
}

function compactRecommendationNote(note, item, viber) {
  if (!note) return `${viber.name} conosce il tuo gusto.`;
  if (note.includes("Hai dato") || note.includes("ti manda questo")) {
    return `${viber.name} conosce il tuo gusto.`;
  }
  if (note.length > 82) {
    return note.slice(0, 79).trim() + "...";
  }
  return note;
}

function openPlayer(title) {
  const item = getItem(title);
  pendingTitle = item.title;
  activeTitle = item.title;
  openTvRating(item.title);
}

function openRating(title) {
  openPhoneRating(title);
}

function setupRating(title, surface) {
  const item = getItem(title);
  pendingTitle = item.title;
  selectedRating = 4;
  selectedMoods = normaliseMoodList([...getItemMoods(item), ...sessionMoods]).slice(0, maxMoodSelection);
  selectedViberName = [...vibers].sort((a, b) => b.trust - a.trust)[0].name;
  activeRatingSurface = surface;
}

function openPhoneRating(title) {
  const item = getItem(title);
  setupRating(title, "phone");
  ratingTitle.textContent = `Com'e andata ${item.title}?`;
  recommendationNote.value = `Mi fido del tuo gusto per: ${moodLabelList(selectedMoods)}.`;
  renderStars();
  renderMoodPicker(phoneMoodPicker, "phone");
  renderViberPicker(phoneViberPicker, "phone");
  openDialog(ratingNotification, ".star-button");
}

function openTvRating(title) {
  const item = getItem(title);
  setupRating(title, "tv");
  tvRatingTitle.textContent = `Com'e andata ${item.title}?`;
  renderTvStars();
  renderMoodPicker(tvMoodPicker, "tv");
  renderViberPicker(tvViberPicker, "tv");
  openDialog(tvRatingOverlay, ".tv-star-button");
}

function renderStars() {
  starPicker.setAttribute("role", "group");
  starPicker.innerHTML = [1, 2, 3, 4, 5].map((value) => {
    const selected = value <= selectedRating ? " is-selected" : "";
    return `<button class="star-button${selected}" data-rating="${value}" type="button" aria-pressed="${value === selectedRating}" aria-label="Imposta rating a ${value} stelle${value === selectedRating ? ", selezionato" : ""}">★</button>`;
  }).join("");

  document.querySelectorAll(".star-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.rating);
      renderStars();
      starPicker.querySelector(`[data-rating="${selectedRating}"]`)?.focus({ preventScroll: true });
    });
  });
}

function renderTvStars() {
  tvStarPicker.setAttribute("role", "group");
  tvStarPicker.innerHTML = [1, 2, 3, 4, 5].map((value) => {
    const selected = value <= selectedRating ? " is-selected" : "";
    return `<button class="tv-star-button${selected}" data-tv-rating="${value}" type="button" aria-pressed="${value === selectedRating}" aria-label="Imposta rating TV a ${value} stelle${value === selectedRating ? ", selezionato" : ""}">★</button>`;
  }).join("");

  document.querySelectorAll("[data-tv-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.tvRating);
      renderTvStars();
      tvStarPicker.querySelector(`[data-tv-rating="${selectedRating}"]`)?.focus({ preventScroll: true });
    });
  });
}

function renderMoodPicker(container, surface) {
  container.innerHTML = moodIds.map((mood) => {
    const selected = selectedMoods.includes(mood) ? " is-selected" : "";
    const disabled = !selected && selectedMoods.length >= maxMoodSelection ? " is-disabled" : "";
    return `<button class="choice-chip${selected}${disabled}" data-mood-choice="${mood}" data-surface="${surface}" type="button" aria-pressed="${selectedMoods.includes(mood)}" aria-disabled="${Boolean(disabled)}" aria-label="${moodLabel(mood)}${selectedMoods.includes(mood) ? ", selezionato" : ""}">${moodLabel(mood)}</button>`;
  }).join("");

  container.querySelectorAll("[data-mood-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.moodChoice;
      toggleMoodSelection(mood, () => {
        renderMoodPicker(container, surface);
        container.querySelector(`[data-mood-choice="${mood}"]`)?.focus({ preventScroll: true });
      });
    });
  });
}

function renderViberPicker(container, surface) {
  const trustedVibers = [...vibers].sort((a, b) => b.trust - a.trust);
  container.innerHTML = trustedVibers.map((viber) => {
    const selected = viber.name === selectedViberName ? " is-selected" : "";
    return `
      <button class="viber-pick${selected}" data-viber-choice="${viber.name}" data-surface="${surface}" type="button">
        <span class="viber-avatar" style="--viber-bg: ${viber.color}" aria-hidden="true">${viber.initials}</span>
        <span>
          <strong>${viber.name}</strong>
          <span>fiducia ${viber.trust}%</span>
        </span>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-viber-choice]").forEach((button) => {
    const viber = getViber(button.dataset.viberChoice);
    const selected = button.dataset.viberChoice === selectedViberName;
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `${viber.name}, fiducia ${viber.trust}%${selected ? ", selezionato" : ""}`);
  });

  container.querySelectorAll("[data-viber-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedViberName = button.dataset.viberChoice;
      renderViberPicker(container, surface);
      container.querySelector(`[data-viber-choice="${selectedViberName}"]`)?.focus({ preventScroll: true });
    });
  });
}

function closeRating(restoreFocus = true) {
  closeDialog(ratingNotification, restoreFocus);
}

function closeTvRating(restoreFocus = true) {
  closeDialog(tvRatingOverlay, restoreFocus);
}

function approveActivity(index) {
  const activity = communityState.activities[index];
  if (!activity) return;

  const approvedBy = getActivityApprovalNames(activity);
  if (approvedBy.includes(currentProfile)) {
    showToast("Hai gia approvato questo consiglio.");
    return;
  }

  const currentBoosts = getActivityApprovalCount(activity);
  activity.approvedBy = [...approvedBy, currentProfile];
  activity.boosts = Math.max(currentBoosts + 1, activity.approvedBy.length);

  const viber = vibers.find((entry) => entry.name === activity.actor);
  if (viber) {
    viber.trust = Math.min(100, viber.trust + 1);
    if (!viberProfile.trust) viberProfile.trust = {};
    viberProfile.trust[viber.name] = viber.trust;
    saveViberProfile();
  }

  saveState();
  renderCommunity();
  showToast(viber ? `Consiglio rafforzato: ${viber.name} sale a ${viber.trust}% di fiducia.` : "Consiglio rafforzato.");
}

function commitInteraction(kind) {
  const item = getItem(pendingTitle);
  const viber = vibers.find((entry) => entry.name === selectedViberName) || vibers[0];
  const moods = selectedMoods.length ? selectedMoods : getItemMoods(item).slice(0, 1);
  const mood = moodLabelList(moods);
  const note = activeRatingSurface === "phone"
    ? recommendationNote.value.trim() || `Perfetto per un mood ${mood}.`
    : `Scelto da TV per un mood ${mood}.`;
  const activityText = kind === "watch"
    ? `ha chiesto a ${viber.name} di guardare insieme ${item.title}`
    : `ha consigliato ${item.title} a ${viber.name}`;
  const viberReply = kind === "watch"
    ? `ha rilanciato una visione condivisa dopo il tuo invito su ${item.title}`
    : `ha consigliato un nuovo titolo dopo il tuo rating su ${item.title}`;

  communityState.ratings.unshift({
    profile: currentProfile,
    title: item.title,
    rating: selectedRating,
    mood,
    moods,
    surface: activeRatingSurface
  });

  communityState.activities.unshift({
    actor: currentProfile,
    text: activityText,
    mood,
    moods
  });

  communityState.recommendations.unshift({
    from: viber.name,
    title: getNextRecommendation(item.title, moods).title,
    mood,
    moods,
    kind,
    note: kind === "watch"
      ? `Fiducia ${viber.trust}% su questo mood.`
      : `${viber.name} conosce il tuo gusto.`
  });

  communityState.activities.unshift({
    actor: viber.name,
    text: viberReply,
    mood,
    moods
  });

  saveState();
  closeRating(false);
  closeTvRating(false);
  renderCommunity();
  showToast(kind === "watch" ? `Invito inviato a ${viber.name}.` : `Consiglio inviato a ${viber.name}.`);
  restoreDialogFocus();
}

function schedulePhoneReminder() {
  closeTvRating(false);
  communityState.activities.unshift({
    actor: "Vibely",
    text: `ti mandera un reminder telefono tra qualche ora per ${pendingTitle}`,
    mood: moodLabelList(selectedMoods),
    moods: selectedMoods
  });
  saveState();
  renderCommunity();
  showToast("Reminder telefono programmato.");
  window.setTimeout(() => openPhoneRating(pendingTitle), 500);
}

function getNextRecommendation(currentTitle, moods) {
  const ids = normaliseMoodList(moods);
  return items.find((item) => item.title !== currentTitle && getItemMoods(item).some((mood) => ids.includes(mood)))
    || items.find((item) => item.title !== currentTitle)
    || items[0];
}

document.querySelectorAll(".profile-card[data-profile]").forEach((button) => {
  button.addEventListener("click", () => openMoodEntry(button.dataset.profile));
});

document.querySelector(".add-profile").addEventListener("click", () => openBuilder("profiles"));
document.querySelector("#openBuilderFromProfiles").addEventListener("click", () => openBuilder("profiles"));
document.querySelector("#closeBuilder").addEventListener("click", closeBuilderView);
document.querySelector("#cancelBuilder").addEventListener("click", closeBuilderView);
document.querySelector("#backToProfilesFromMood").addEventListener("click", backToProfiles);
document.querySelector("#continueWithMood").addEventListener("click", () => enterHome(pendingProfile, selectedMoods));
document.querySelector("#skipMoodEntry").addEventListener("click", () => enterHome(pendingProfile, []));

document.querySelector("#backProfiles").addEventListener("click", backToProfiles);

document.querySelector("#heroPlayButton").addEventListener("click", () => openPlayer("After Midnight"));
document.querySelector("#simulateFinish")?.addEventListener("click", () => openTvRating(activeTitle));
document.querySelector("#simulatePhoneReminder")?.addEventListener("click", () => openPhoneRating(activeTitle));
document.querySelector("#dismissRating").addEventListener("click", closeRating);
document.querySelector("#dismissTvRating").addEventListener("click", closeTvRating);
document.querySelector("#sendRecommendation").addEventListener("click", () => commitInteraction("recommend"));
document.querySelector("#watchTogether").addEventListener("click", () => commitInteraction("watch"));
document.querySelector("#tvSendRecommendation").addEventListener("click", () => commitInteraction("recommend"));
document.querySelector("#tvWatchTogether").addEventListener("click", () => commitInteraction("watch"));
document.querySelector("#tvPhoneLater").addEventListener("click", schedulePhoneReminder);

document.querySelectorAll("[data-bottom-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.bottomNav;
    if (target === "home") scrollHomeToTop();
    if (target === "community") scrollToCommunity();
    if (target === "profile") {
      setBottomNavActive("profile");
      openBuilder("home");
    }
  });
});

document.querySelectorAll(".nav-tab[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab[data-filter]").forEach((tab) => {
      tab.classList.remove("is-active");
      tab.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    activeFilter = button.dataset.filter;
    renderCatalog();
  });
});

document.querySelectorAll(".mood-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mood-chip").forEach((chip) => {
      chip.classList.remove("is-active");
      chip.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    activeMood = button.dataset.mood;
    renderCatalog();
  });
});

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  renderCatalog();
});

function openInitialRouteFromHash() {
  const target = window.location.hash.replace("#", "");
  if (target === "profiles") {
    backToProfiles();
    return;
  }
  if (target === "home" || target === "communitySection") {
    enterHome(viberProfile.name || currentProfile, normaliseMoodList(viberProfile.moods));
    if (target === "communitySection") {
      window.setTimeout(() => scrollToCommunity(), 120);
    }
  }
}

builderName.addEventListener("input", updateBuilderPreview);

document.querySelectorAll("[data-builder-mood]").forEach((button) => {
  button.addEventListener("click", () => {
    const mood = button.dataset.builderMood;
    const moods = normaliseMoodList(viberProfile.moods);
    if (moods.includes(mood)) {
      viberProfile.moods = moods.filter((item) => item !== mood);
    } else if (moods.length >= maxMoodSelection) {
      showToast("Puoi scegliere massimo 3 mood nel profilo.");
      return;
    } else {
      viberProfile.moods = [...moods, mood];
    }
    button.classList.toggle("is-selected");
    button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));
    updateBuilderPreview();
  });
});

document.querySelectorAll("[data-builder-genre]").forEach((button) => {
  button.addEventListener("click", () => {
    const genre = button.dataset.builderGenre;
    if (viberProfile.genres.includes(genre)) {
      viberProfile.genres = viberProfile.genres.filter((item) => item !== genre);
    } else {
      viberProfile.genres.push(genre);
    }
    button.classList.toggle("is-selected");
    button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));
    updateBuilderPreview();
  });
});

builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  viberProfile.name = builderName.value.trim() || "Nuovo Viber";
  viberProfile.moods = normaliseMoodList(viberProfile.moods);
  viberProfile.mode = recommendationMode.value;
  applyViberProfile(viberProfile);
  saveViberProfile();
  profileGreeting.textContent = viberProfile.name;
  openHome(viberProfile.name);
});

document.addEventListener("keydown", (event) => {
  keepFocusInDialog(event);
  if (event.key === "Escape" && !activeDialog() && !builderView.classList.contains("hidden")) {
    closeBuilderView();
  }
});

renderStars();
openInitialRouteFromHash();
