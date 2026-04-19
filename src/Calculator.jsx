import { useMemo, useState } from "react";
import "./Calculator.css";

const CITY_DATA = {
  "Los Angeles, CA": {
    zip: "90012",
    gridKgPerKwh: 0.21,
    usAvg: 10.6,
    cityAvg: 11.2,
    stateAvg: 10.9,
    zipAvg: 9.8,
  },
  "Seattle, WA": {
    zip: "98101",
    gridKgPerKwh: 0.04,
    usAvg: 10.6,
    cityAvg: 8.1,
    stateAvg: 8.5,
    zipAvg: 7.7,
  },
  "Houston, TX": {
    zip: "77002",
    gridKgPerKwh: 0.39,
    usAvg: 10.6,
    cityAvg: 13.4,
    stateAvg: 12.8,
    zipAvg: 12.2,
  },
  "New York, NY": {
    zip: "10001",
    gridKgPerKwh: 0.18,
    usAvg: 10.6,
    cityAvg: 8.9,
    stateAvg: 9.6,
    zipAvg: 8.4,
  },
};

const DIET_MULTIPLIERS = {
  vegan: 0.6,
  vegetarian: 0.9,
  mixed: 1.2,
  high_meat: 1.8,
};

const SHOPPING_DAYS_TO_TONS = {
  0: 0.2,
  1: 0.4,
  2: 0.7,
  3: 1.0,
  4: 1.3,
  5: 1.5,
  6: 1.7,
  7: 1.9,
};

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function formatTons(value) {
  return `${value.toFixed(1)} t`;
}

function formatPercent(value) {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function cleanNumberInput(value) {
  if (value === "") return "";
  return String(Number(value));
}

function getBestMove(categories, form, city) {
  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const top = sorted[0];

  if (!top) {
    return {
      title: "Nice start",
      text: "Enter your habits to see your highest-impact improvement.",
      saving: "Potential saving: —",
    };
  }

  if (top.key === "transport") {
    if (!form.hasEV) {
      return {
        title: "Switch to EV or go car-free 2 days/week",
        text: `Transport is your largest category at ${top.value.toFixed(
          1
        )} t/yr. In ${city}, changing your driving habits can noticeably cut emissions.`,
        saving: `Potential saving: ~${Math.max(
          0.6,
          top.value * 0.35
        ).toFixed(1)} t CO₂e/yr · High impact, medium effort`,
      };
    }

    return {
      title: "Drive less even with an EV",
      text: `Transport is still your largest category at ${top.value.toFixed(
        1
      )} t/yr. Try transit, carpooling, or combining trips.`,
      saving: `Potential saving: ~${Math.max(
        0.3,
        top.value * 0.2
      ).toFixed(1)} t CO₂e/yr · High impact, low-medium effort`,
    };
  }

  if (top.key === "home") {
    return {
      title: "Cut home electricity use",
      text: `Home energy is your largest category at ${top.value.toFixed(
        1
      )} t/yr. In ${city}, local grid emissions make electricity use important.`,
      saving: `Potential saving: ~${Math.max(
        0.4,
        top.value * 0.25
      ).toFixed(1)} t CO₂e/yr · Medium impact, low effort`,
    };
  }

  if (top.key === "diet") {
    return {
      title: "Shift a few meals plant-forward",
      text: `Diet is your largest category at ${top.value.toFixed(
        1
      )} t/yr. Reducing meat-heavy meals each week can help a lot.`,
      saving: `Potential saving: ~${Math.max(
        0.4,
        top.value * 0.3
      ).toFixed(1)} t CO₂e/yr · Medium-high impact, medium effort`,
    };
  }

  return {
    title: "Buy less, buy longer-lasting",
    text: `Shopping is one of your biggest categories. Cutting unnecessary purchases can reduce your footprint.`,
    saving: `Potential saving: ~${Math.max(
      0.3,
      top.value * 0.25
    ).toFixed(1)} t CO₂e/yr · Medium impact, medium effort`,
  };
}

export default function Calculator({ onBack }) {
  const [city, setCity] = useState("Los Angeles, CA");
  const [form, setForm] = useState({
    milesPerWeek: "180",
    hasEV: false,
    electricityKwhMonth: "420",
    diet: "mixed",
    shoppingDays: "2",
    flightsPerYear: "2",
  });

  const cityInfo = CITY_DATA[city];

  const result = useMemo(() => {
    const milesPerWeek = Number(form.milesPerWeek) || 0;
    const electricityKwhMonth = Number(form.electricityKwhMonth) || 0;
    const flightsPerYear = Number(form.flightsPerYear) || 0;

    const annualMiles = milesPerWeek * 52;
    const transportKgPerMile = form.hasEV ? 0.11 : 0.36;
    const transport = (annualMiles * transportKgPerMile) / 1000;
    const home = (electricityKwhMonth * 12 * cityInfo.gridKgPerKwh) / 1000;
    const dietTons = DIET_MULTIPLIERS[form.diet];
    const shoppingTons = SHOPPING_DAYS_TO_TONS[form.shoppingDays];
    const flightsTons = flightsPerYear * 0.9;

    const total = transport + home + dietTons + shoppingTons + flightsTons;

    const categories = [
      { key: "transport", label: "Transport", value: transport, colorClass: "blue" },
      { key: "home", label: "Home energy", value: home, colorClass: "green" },
      { key: "diet", label: "Diet", value: dietTons, colorClass: "gold" },
      { key: "shopping", label: "Shopping", value: shoppingTons + flightsTons, colorClass: "pink" },
    ];

    const vsZip = ((total - cityInfo.zipAvg) / cityInfo.zipAvg) * 100;
    const vsUs = ((total - cityInfo.usAvg) / cityInfo.usAvg) * 100;
    const targetRatio = total / 4.0;
    const bestMove = getBestMove(categories, form, city);

    return { total, categories, vsZip, vsUs, targetRatio, bestMove };
  }, [form, city, cityInfo]);

  const maxCategory = Math.max(...result.categories.map((c) => c.value), 1);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function benchmarkPercent(avg) {
    return clamp((result.total / (avg * 1.5)) * 100, 8, 92);
  }

  return (
    <div className="calc-page">
      <section className="calc-shell">
        <button className="calc-back-btn" onClick={onBack}>
          ← Back to Home
        </button>

        <div className="calc-header">
          <p className="calc-kicker">Hyper-local carbon calculator</p>
          <h1 className="calc-title">See how your lifestyle impacts the ocean.</h1>
          <p className="calc-subtitle">
            Enter a few habits, choose your city, and get a location-aware carbon footprint result.
          </p>
        </div>

        <div className="calc-controls">
          <div className="calc-badge">
            ZIP {cityInfo.zip} · Grid: {cityInfo.gridKgPerKwh.toFixed(2)} kg CO₂/kWh
          </div>

          <select
            className="calc-city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {Object.keys(CITY_DATA).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="calc-form-card">
          <div className="calc-form-grid">
            <label className="calc-field">
              <span>Transport miles per week</span>
              <input
                type="number"
                min="0"
                value={form.milesPerWeek}
                onChange={(e) =>
                  updateField("milesPerWeek", cleanNumberInput(e.target.value))
                }
              />
            </label>

            <label className="calc-field">
              <span>Electricity use (kWh/month)</span>
              <input
                type="number"
                min="0"
                value={form.electricityKwhMonth}
                onChange={(e) =>
                  updateField("electricityKwhMonth", cleanNumberInput(e.target.value))
                }
              />
            </label>

            <label className="calc-field">
              <span>Diet</span>
              <select
                value={form.diet}
                onChange={(e) => updateField("diet", e.target.value)}
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="mixed">Mixed</option>
                <option value="high_meat">High meat</option>
              </select>
            </label>

            <label className="calc-field">
              <span>Shopping Frequency (times a week)</span>
              <select
                value={form.shoppingDays}
                onChange={(e) => updateField("shoppingDays", e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label className="calc-field">
              <span>Flights per year</span>
              <input
                type="number"
                min="0"
                value={form.flightsPerYear}
                onChange={(e) =>
                  updateField("flightsPerYear", cleanNumberInput(e.target.value))
                }
              />
            </label>

            <label className="calc-check">
              <input
                type="checkbox"
                checked={form.hasEV}
                onChange={(e) => updateField("hasEV", e.target.checked)}
              />
              <span>I primarily drive an EV</span>
            </label>
          </div>
        </div>

        <div className="calc-summary-grid">
          <div className="calc-stat">
            <p className="calc-stat-label">Your footprint</p>
            <h2>{formatTons(result.total)}</h2>
            <p>CO₂e per year</p>
          </div>

          <div className="calc-stat">
            <p className="calc-stat-label">Vs. your ZIP</p>
            <h2 className={result.vsZip <= 0 ? "good" : "bad"}>
              {formatPercent(result.vsZip)}
            </h2>
            <p>Avg: {formatTons(cityInfo.zipAvg)}</p>
          </div>

          <div className="calc-stat">
            <p className="calc-stat-label">Vs. US avg</p>
            <h2 className={result.vsUs <= 0 ? "good" : "bad"}>
              {formatPercent(result.vsUs)}
            </h2>
            <p>Avg: {formatTons(cityInfo.usAvg)}</p>
          </div>

          <div className="calc-stat">
            <p className="calc-stat-label">1.5°C target</p>
            <h2 className={result.targetRatio <= 1 ? "good" : "bad"}>
              {result.targetRatio.toFixed(1)}×
            </h2>
            <p>Target: 4.0 t</p>
          </div>
        </div>

        <div className="calc-panels">
          <div className="calc-panel">
            <h3>Breakdown by category</h3>
            <div className="calc-bars">
              {result.categories.map((cat) => (
                <div className="calc-bar-row" key={cat.key}>
                  <span className="calc-bar-label">{cat.label}</span>
                  <div className="calc-bar-track">
                    <div
                      className={`calc-bar-fill ${cat.colorClass}`}
                      style={{ width: `${(cat.value / maxCategory) * 100}%` }}
                    />
                  </div>
                  <span className="calc-bar-value">{cat.value.toFixed(1)} t</span>
                </div>
              ))}
            </div>
          </div>

          <div className="calc-panel">
            <h3>Neighborhood benchmark</h3>

            <div className="benchmark-list">
              {[
                { label: "Your ZIP", avg: cityInfo.zipAvg },
                { label: "City avg", avg: cityInfo.cityAvg },
                { label: "State avg", avg: cityInfo.stateAvg },
                { label: "US avg", avg: cityInfo.usAvg },
              ].map((item) => (
                <div className="benchmark-row" key={item.label}>
                  <span className="benchmark-label">{item.label}</span>
                  <div className="benchmark-track">
                    <div
                      className="benchmark-marker"
                      style={{ left: `${benchmarkPercent(item.avg)}%` }}
                    />
                  </div>
                  <span className="benchmark-value">{item.avg.toFixed(1)} t avg</span>
                </div>
              ))}
            </div>

            <p className="benchmark-note">
              Vertical line = your footprint ({result.total.toFixed(1)} t)
            </p>
          </div>
        </div>

        <div className="calc-best-move">
          <p className="calc-best-move-kicker">Your single best move</p>
          <h3>{result.bestMove.title}</h3>
          <p>{result.bestMove.text}</p>
          <strong>{result.bestMove.saving}</strong>
        </div>
      </section>
    </div>
  );
}