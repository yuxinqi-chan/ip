import { Hono } from "hono";
import { renderer } from "./renderer";
import api from "./api";
import { getIpInfo } from "./utils";
import { translations } from "./i18n";

const app = new Hono();

app.use(renderer);

app.route("/api", api);

app.get("/", (c) => {
  const {
    ip: clientIP,
    ipVersion,
    country,
    city,
    region,
    timezone,
    isp: asOrganization,
    asn,
    latitude,
    longitude,
  } = getIpInfo(c.req.header("CF-Connecting-IP"), c.req.raw.cf);
  let lang = c.req.query("lang") || "en";
  if (Object.hasOwn(translations, lang)) {
    lang = "en";
  }
  const t = translations[lang as keyof typeof translations];
  return c.render(
    <>
      <div class="container">
        <h1>{t.title}</h1>
        <div class="info-grid">
          <div class="info-item ip-address">
            <div class="label">{t.ip}</div>
            <div class="value">{clientIP}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.country}</div>
            <div class="value">{country}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.city}</div>
            <div class="value">{city}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.region}</div>
            <div class="value">{region}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.timezone}</div>
            <div class="value">{timezone}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.isp}</div>
            <div class="value">{asOrganization}</div>
          </div>
          <div class="info-item">
            <div class="label">{t.asn}</div>
            <div class="value">{asn}</div>
          </div>
        </div>
        <button id="mapToggle">{t.showMap}</button>
        <div
          id="map"
          style="display: none; height: 300px; width: 100%; margin-top: 20px;"
        ></div>
        <div class="language-selector">
          <a href="?lang=en">English</a>
          <a href="?lang=zh-TW">繁體中文</a>
          <a href="?lang=zh-CN">简体中文</a>
          <a href="?lang=ja">日本語</a>
          <a href="?lang=ko">한국어</a>
          <button id="darkModeToggle">
            <i class="fas fa-moon"></i>
          </button>
        </div>
      </div>
      <footer>
        <a
          href="https://github.com/KKKKKCAT/CF-IPInfo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.sourceCode}
        </a>
        <span style="margin-left: 10px; color: var(--primary-color);">
          ver:1.0.1
        </span>
      </footer>
      <script
        dangerouslySetInnerHTML={{
          __html: `const darkModeToggle = document.getElementById('darkModeToggle');
      const body = document.body;
      const mapToggle = document.getElementById('mapToggle');
      const mapContainer = document.getElementById('map');
      let map;

      darkModeToggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');
          const isDarkMode = body.classList.contains('dark-mode');
          darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });

      mapToggle.addEventListener('click', () => {
          if (mapContainer.style.display === 'none') {
          mapContainer.style.display = 'block';
          mapToggle.textContent = '${t.hideMap}';
          setTimeout(initMap, 0);
          } else {
          mapContainer.style.display = 'none';
          mapToggle.textContent = '${t.showMap}';
          }
      });

      function initMap() {
          if (!map) {
          map = L.map('map').setView([${latitude}, ${longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19
          }).addTo(map);
          L.marker([${latitude}, ${longitude}]).addTo(map)
              // .bindPopup('🐱')
              .openPopup();
          }
          map.invalidateSize();
      }`,
        }}
      ></script>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    </>
  );
});
export default app;
