const API_KEY = 'b2fe2f944fb94daa990134435251212';
const BASE = 'https://api.weatherapi.com/v1/current.json';


// UI references
const form = document.getElementById('searchForm');
const input = document.getElementById('locationInput');
const output = document.getElementById('output');
const errorBox = document.getElementById('errorBox');
const btn = document.getElementById('searchBtn');

function showError(msg) {
    errorBox.style.display = 'block';
    errorBox.textContent = msg;
}
function clearError() {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
}

function renderWeather(data) {
    const location = data.location;
    const current = data.current;

    const html = `
    <article class="result">
      <div class="icon">
        <img src="https:${current.condition.icon}" 
             alt="${current.condition.text}" width="64" height="64" />
      </div>
      <div>
        <div style="font-size:14px;color:var(--muted)">
          ${location.name}, ${location.region || location.country}
        </div>
        <div class="temp">${Math.round(current.temp_c)}°C / ${Math.round(current.temp_f)}°F</div>
        <div class="meta">${current.condition.text} · Last updated: ${current.last_updated}</div>

        <div class="extra">
          <div class="chip">Feels like: ${Math.round(current.feelslike_c)}°C</div>
          <div class="chip">Humidity: ${current.humidity}%</div>
          <div class="chip">Wind: ${current.wind_kph} kph</div>
          <div class="chip">Pressure: ${current.pressure_mb} mb</div>
        </div>
      </div>
    </article>
  `;

    output.innerHTML = html;
}

// Fetch weather data
async function fetchWeather(q) {
    const url = `${BASE}?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=yes`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Invalid location or network error");

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return data;
}

// Form submit handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    output.innerHTML = '';

    const q = input.value.trim();
    if (!q) return showError('Please enter a location.');

    btn.disabled = true;
    btn.textContent = 'Loading...';

    try {
        const data = await fetchWeather(q);
        renderWeather(data);
    }
    catch (err) {
        console.error(err);
        showError(err.message);
    }

    btn.disabled = false;
    btn.textContent = 'Get weather';
});
