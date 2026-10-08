import { WeatherData } from '../types';

export interface LocationCoordinates {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const POPULAR_LOCATIONS: LocationCoordinates[] = [
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lon: 79.5941 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  { name: 'Khammam', state: 'Telangana', lat: 17.2473, lon: 80.1514 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lon: 78.0941 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 }
];

export function getWeatherConditionFromCode(code: number): { text: string; rainAlert: boolean } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { text: 'Clear Sky / Sunny', rainAlert: false };
  if (code === 1 || code === 2) return { text: 'Mainly Clear / Partly Cloudy', rainAlert: false };
  if (code === 3) return { text: 'Overcast', rainAlert: false };
  if (code >= 45 && code <= 48) return { text: 'Foggy / Mist', rainAlert: false };
  if (code >= 51 && code <= 55) return { text: 'Drizzle / Light Showers', rainAlert: false };
  if (code >= 61 && code <= 65) return { text: 'Rain Showers', rainAlert: true };
  if (code >= 71 && code <= 77) return { text: 'Snow / Hail', rainAlert: true };
  if (code >= 80 && code <= 82) return { text: 'Heavy Rain Showers', rainAlert: true };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm & Heavy Downpour', rainAlert: true };
  return { text: 'Partly Cloudy', rainAlert: false };
}

export async function fetchLiveWeather(lat: number, lon: number, locationName: string): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo weather fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current_weather;
  const daily = data.daily;

  const conditionInfo = getWeatherConditionFromCode(current.weathercode);
  const currentHourIndex = new Date().getHours();
  const currentHumidity = data.hourly?.relativehumidity_2m?.[currentHourIndex] || 68;
  const todayRainProb = daily?.precipitation_probability_max?.[0] || (conditionInfo.rainAlert ? 80 : 20);

  const rainAlert = conditionInfo.rainAlert || todayRainProb > 60;
  const rainAlertMsg = rainAlert
    ? `Rain probability is ${todayRainProb}%. Postpone pesticide/fertilizer foliar spraying & prepare drainage channels.`
    : `Favorable farming conditions today with low rain probability (${todayRainProb}%). Ideal for field preparation and irrigation.`;

  const farmingAdvisory = rainAlert
    ? 'High humidity & moisture detected. Watch out for fungal attacks like Blast and Leaf Spot. Secure harvest heaps.'
    : 'Clear weather pattern. Maintain standing water in paddy fields and check soil moisture in root zones.';

  // Format 5-day forecast
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const forecast = (daily?.time || []).slice(0, 5).map((timeStr: string, idx: number) => {
    const d = new Date(timeStr);
    const dayLabel = idx === 0 ? 'Today' : daysOfWeek[d.getDay()];
    const code = daily.weathercode?.[idx] ?? 0;
    const cond = getWeatherConditionFromCode(code).text;
    const tempMax = Math.round(daily.temperature_2m_max?.[idx] ?? current.temperature);
    const rainProb = daily.precipitation_probability_max?.[idx] ?? 10;

    return {
      day: dayLabel,
      temp: tempMax,
      rain_chance: rainProb,
      condition: cond
    };
  });

  return {
    district: locationName,
    temp: Math.round(current.temperature),
    temp_min: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature - 5),
    temp_max: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature + 4),
    condition: conditionInfo.text,
    rain_chance: todayRainProb,
    humidity: currentHumidity,
    wind_speed: Math.round(current.windspeed),
    rain_alert: rainAlert,
    rain_alert_msg: rainAlertMsg,
    farming_advisory: farmingAdvisory,
    last_updated: `Live at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
    forecast: forecast.length > 0 ? forecast : [
      { day: 'Today', temp: Math.round(current.temperature), rain_chance: todayRainProb, condition: conditionInfo.text }
    ]
  };
}
