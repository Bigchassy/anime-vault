"use strict";
const $ = id => document.getElementById(id);
let posts = [], filter = "All";
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function imageURL(value) {
  if (!value) return "";
  try {
    const url = new URL(value, document.baseURI);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}
function meta(p) {
  return escapeHTML(p.author || "Anime Vault") + " · " + escapeHTML(p.date || "") + " · " +
    Math.max(1, Math.ceil(p.body.trim().split(/\s+/).length / 200)) + " min read";
}
function render() {
  const categories = ["All", ...new Set(posts.map(p => p.category))];
  if (!categories.includes(filter)) filter = "All";
  $("filters").innerHTML = categories.map(c =>
    '<button type="button" aria-pressed="' + (c === filter) + '" class="' +
    (c === filter ? "active" : "") + '" data-category="' + escapeHTML(c) + '">' +
    escapeHTML(c) + '</button>').join("");
  const query = $("search").value.trim().toLowerCase();
  const visible = posts.filter(p => (filter === "All" || p.category === filter) &&
    (p.title + " " + p.excerpt + " " + p.body).toLowerCase().includes(query));
  $("posts").innerHTML = visible.map(p => {
    const image = imageURL(p.image);
    return '<article class="card"><div class="cover" aria-hidden="true">' +
      (image ? '<img src="' + escapeHTML(image) + '" alt="" loading="lazy">' : "") +
      '</div><div class="card-body"><span class="tag">' + escapeHTML(p.category) +
      '</span><h3>' + escapeHTML(p.title) + '</h3><p>' + escapeHTML(p.excerpt) +
      '</p><a class="read" href="#post=' + encodeURIComponent(p.id) + '">Read story ↗</a>' +
      '<div class="meta">' + meta(p) + '</div></div></article>';
  }).join("");
  $("empty").hidden = visible.length > 0;
}
function openArticle() {
  if (!location.hash.startsWith("#post=")) {
    if ($("reader").open) $("reader").close();
    return;
  }
  let id;
  try { id = decodeURIComponent(location.hash.slice(6)); } catch { return; }
  const p = posts.find(p => p.id === id);
  if (!p) {
    $("load-status").textContent = "This article is unavailable or unpublished.";
    return;
  }
  const image = imageURL(p.image);
  $("article").innerHTML = '<div class="tag">' + escapeHTML(p.category) +
    '</div><h2 class="article-title">' + escapeHTML(p.title) +
    '</h2><p class="meta">' + meta(p) + '</p>' +
    (image ? '<img class="article-image" src="' + escapeHTML(image) + '" alt="' + escapeHTML(p.title) + '">' : "") +
    '<p><a class="share-link" href="' + escapeHTML(location.href) + '">Article permalink ↗</a></p>' +
    '<div class="article-text">' + escapeHTML(p.body) + '</div>';
  document.title = p.title + " | Anime Vault";
  if (!$("reader").open) $("reader").showModal();
}
$("filters").addEventListener("click", e => {
  const b = e.target.closest("[data-category]");
  if (b) { filter = b.dataset.category; render(); }
});
$("search").addEventListener("input", render);
$("reader").querySelector(".close").addEventListener("click", () => $("reader").close());
$("reader").addEventListener("close", () => {
  if (location.hash.startsWith("#post=")) history.replaceState(null, "", location.pathname + location.search + "#journal");
  document.title = "Anime Vault | Anime Blog";
});
window.addEventListener("hashchange", openArticle);
$("year").textContent = new Date().getFullYear();
async function loadPosts() {
  try {
    const response = await fetch("posts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load articles");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid article data");
    const ids = new Set();
    posts = data.filter(p => {
      if (!p || p.published !== true || !["id","title","category","excerpt","body"].every(k => typeof p[k] === "string") || !p.id || ids.has(p.id)) return false;
      ids.add(p.id); return true;
    }).sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    $("load-status").textContent = "";
    render();
    openArticle();
  } catch {
    $("load-status").textContent = "Articles could not load. Please refresh to try again.";
    $("empty").hidden = true;
  }
}
loadPosts();
