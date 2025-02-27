import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>duckun</h1>
        <p>Simpler version of <a href="https://unduck.link" target="_blank">Unduck.link</a> using DuckDuckGo's <a href="https://duckduckgo.com/bang.html" target="_blank">bangs.</a></p>
        <div class="url-container"> 
          <p class="url-input">https://u.thatcanoa.org?q=%s</p>
        </div>
      </div>
      <footer class="footer">
        <a href="https://github.com/nocanoa/unduckk" target="_blank">github</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">theo github</a>

      </footer>
    </div>
  `;
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "bs";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
