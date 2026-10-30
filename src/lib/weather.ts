const LAT=31.5925, LNG=74.3146;
type WxDay = { dow: string; tmax: number; tmin: number; pop: number; icon: string; label: string };
type WxAdvice = { dress: string[]; act: string[]; items: string[]; risks: string[] };
export type WxData = {
  fetchedAt: string; modelTime: string;
  current: {
    temperature_2m: number; apparent_temperature: number; relative_humidity_2m: number;
    wind_speed_10m: number; wind_direction_10m: number; weather_code: number; precipitation: number;
    windLevel: number; windText: string; uv: number;
  };
  sunrise: string;
  sunset: string;
  daily: WxDay[];
  advice: WxAdvice;
};

export function wmo(code: number) {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'rain';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloud';
}
export function wmoLabel(code: number) {
  if (code === 0) return 'Clear';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code === 56 || code === 57) return 'Freezing drizzle';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code === 66 || code === 67) return code === 67 ? 'Heavy freezing rain' : 'Light freezing rain';
  if (code >= 61 && code <= 65) return code === 65 ? 'Heavy rain' : 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95) return code >= 96 ? 'Thunderstorm with hail' : 'Thunderstorm';
  return 'Cloudy';
}
export function fmtTime(iso: string) {
  const t = (iso.split('T')[1] || '00:00');
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
}
function dow(iso: string) {
  const [y, mo, da] = iso.split('T')[0].split('-').map(Number);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(Date.UTC(y, mo - 1, da)).getUTCDay()];
}
function windBeaufort(kmh: number): number {
  const t = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  let lvl = 0;
  for (let i = 0; i < t.length; i++) if (kmh > t[i]) lvl = i + 1;
  return lvl;
}
function compass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}
export function buildAdvice(o: {
  curCode: number; tmax: number; tmin: number; pop: number; windLevel: number; uv: number; humidity: number;
}): WxAdvice {
  const dress: string[] = [];
  const act: string[] = [];
  const items: string[] = [];
  const risks: string[] = [];

  const isThunder = o.curCode >= 95;
  const isFreezing = [56,57,66,67].includes(o.curCode);
  const isHeavy = [65, 67, 82].includes(o.curCode);
  const isRain = (o.curCode >= 51 && o.curCode <= 67) || (o.curCode >= 80 && o.curCode <= 82);
  const isLight = [51, 53, 56, 61, 80].includes(o.curCode);
  const isSunny = o.curCode <= 1;
  const isCloudy = o.curCode === 2 || o.curCode === 3;
  const isFog = o.curCode === 45 || o.curCode === 48;
  const diff = o.tmax - o.tmin;

  if (o.tmax >= 32) dress.push('It is hot — avoid the midday sun and wear light, breathable clothing');
  if (o.tmax <= 10) dress.push('Cold — bring a warm coat');
  else if (diff > 8) dress.push('Big day-to-night temperature swing — bring a layer you can add or remove');
  if (o.uv >= 5) dress.push('Strong UV — use sunscreen, sunglasses and a hat');
  if (isHeavy) dress.push('Heavy precipitation — wear a waterproof jacket');
  else if (isRain || o.pop >= 60) dress.push('Carry rain gear or a waterproof jacket');
  if (o.windLevel >= 7) dress.push('Strong wind — secure your hat and avoid loose clothing');
  if (isFog) dress.push('Low visibility — take care and keep warm');

  if (isThunder) risks.push('Thunderstorm — avoid lightning: do not shelter under trees, stay away from high ground and open water');
  if (isHeavy) {
    risks.push(o.curCode === 67 ? 'Heavy freezing rain — icy surfaces may form; avoid exposed paths' : 'Heavy rain — avoid low-lying and flooded areas; follow official warnings');
    act.push('Limit exposed outdoor plans; identify suitable substantial shelter independently');
  }
  if (o.pop >= 60) act.push('High chance of rain — plan indoor activities and keep rain gear handy');
  if (isFreezing && !isHeavy) risks.push('Freezing precipitation — surfaces may become icy; postpone exposed walking when necessary');
  if (isLight && !isHeavy) act.push(isFreezing ? 'Freezing precipitation can make surfaces icy; avoid exposed paths' : 'Light rain — paths may be slippery, watch your step');
  if (o.tmax >= 32 && !isHeavy) act.push('Keep outdoor time short and avoid the midday heat');
  if (isSunny) act.push('Clear skies do not confirm safe access or opening hours; use only a permitted route and check heat and air quality');
  if (isCloudy) act.push('Cloud cover does not confirm safe access or opening hours; keep plans within the currently permitted visitor times');
  if (isFog) act.push('Poor visibility — skip long-distance views and slow your pace');
  if (o.windLevel >= 7) {
    risks.push('High wind — stay clear of hoardings, high ground and open areas');
    act.push('Postpone exposed outdoor plans in high wind and follow current instructions');
  } else if (o.windLevel >= 5) act.push('Prepare for wind; this model does not report whether any facility is operating');

  if (isHeavy) items.push('Raincoat (avoid long umbrellas in strong wind)');
  else if (isRain || o.pop >= 60) items.push('Umbrella / raincoat');
  if (o.tmax >= 32 || o.uv >= 5) items.push('Sunscreen');
  if (o.uv >= 5) items.push('Sunglasses, sun hat');
  if (o.tmax >= 32) items.push('Plenty of water, heat-relief items');
  if (diff > 8 || o.tmax <= 15 || isHeavy) items.push('A jacket / light layer');
  if (isFog) items.push('A mask');
  if (o.humidity >= 75 && o.tmax >= 28) items.push('A sweat towel');

  return { dress, act, items, risks };
}

let weatherCache: { ts: number; data: WxData } | null = null;
const WX_TTL = 15 * 60 * 1000;

export async function getWeather(): Promise<WxData> {
  const now = Date.now();
  if (weatherCache && now - weatherCache.ts < WX_TTL && now - Date.parse(weatherCache.data.modelTime + '+05:00') < 4*3600000) return weatherCache.data;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
    `&timezone=Asia%2FKarachi&forecast_days=7`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error('wx ' + res.status);
  const j: any = await res.json();
  const c = j.current;
  const model = Date.parse(`${c?.time}+05:00`);
  const codes=[0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99];
  const today = new Date(now + 18000000).toISOString().slice(0, 10);
  if (!codes.includes(c?.weather_code) || !j.daily?.weather_code?.every((n: number) => codes.includes(n)) || c?.relative_humidity_2m < 0 || c?.relative_humidity_2m > 100 || c?.wind_speed_10m < 0 || j.timezone !== 'Asia/Karachi' || !Number.isFinite(model) || now-model > 4*3600000 || model-now > 3600000 ||
    !['temperature_2m','apparent_temperature','relative_humidity_2m','wind_speed_10m','wind_direction_10m','weather_code','precipitation'].every(k => Number.isFinite(c?.[k])) ||
    !Array.isArray(j.daily?.time) || j.daily.time.length !== 7 || j.daily.time[0] !== today || !j.daily.time.every((v: string, i: number) => v === new Date(Date.parse(today+'T00:00:00Z')+i*86400000).toISOString().slice(0,10)) ||
    !j.daily.precipitation_probability_max?.every((n: number) => n >= 0 && n <= 100) ||
    !['weather_code','temperature_2m_max','temperature_2m_min','precipitation_probability_max','uv_index_max'].every(k => Array.isArray(j.daily[k]) && j.daily[k].length === 7 && j.daily[k].every(Number.isFinite)) ||
    !['sunrise','sunset'].every(k => Array.isArray(j.daily[k]) && j.daily[k].length === 7 && j.daily[k].every((v: unknown) => typeof v === 'string' && Number.isFinite(Date.parse(v))))) throw new Error('invalid or stale weather');
  const curCode = c.weather_code as number;
  const windLevel = windBeaufort(c.wind_speed_10m as number);
  const windText = `${compass(c.wind_direction_10m as number)} ${windLevel}`;
  const uv = (j.daily.uv_index_max[0] as number) ?? 0;
  const daily: WxDay[] = (j.daily.time as string[]).map((t: string, i: number) => {
    const code = j.daily.weather_code[i] as number;
    return {
      dow: dow(t),
      tmax: j.daily.temperature_2m_max[i] as number,
      tmin: j.daily.temperature_2m_min[i] as number,
      pop: j.daily.precipitation_probability_max[i] as number,
      icon: wmo(code),
      label: wmoLabel(code)
    };
  });
  const d0 = daily[0];
  const advice = buildAdvice({
    curCode,
    tmax: d0.tmax,
    tmin: d0.tmin,
    pop: d0.pop,
    windLevel,
    uv,
    humidity: c.relative_humidity_2m as number
  });
  const data: WxData = {
    fetchedAt: new Date(now).toISOString(), modelTime: c.time,
    current: {
      temperature_2m: c.temperature_2m,
      apparent_temperature: c.apparent_temperature,
      relative_humidity_2m: c.relative_humidity_2m,
      wind_speed_10m: c.wind_speed_10m,
      wind_direction_10m: c.wind_direction_10m,
      weather_code: curCode,
      precipitation: c.precipitation ?? 0,
      windLevel,
      windText,
      uv
    },
    sunrise: j.daily.sunrise[0],
    sunset: j.daily.sunset[0],
    daily,
    advice
  };
  weatherCache = { ts: now, data };
  return data;
}
