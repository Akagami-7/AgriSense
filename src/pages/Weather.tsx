import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Droplets, Wind, Thermometer, CloudSun, Eye, Gauge, CloudDrizzle, Snowflake, AlertTriangle, Leaf, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const getIcon = (code: string) => {
  const map: any = {
    "01": Sun,
    "02": CloudSun,
    "03": Cloud,
    "04": Cloud,
    "09": CloudDrizzle,
    "10": CloudRain,
    "11": AlertTriangle,
    "13": Snowflake,
    "50": Eye,
  };
  return map[code.substring(0, 2)] || Cloud;
};

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [current, setCurrent] = useState<any>(null);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number, lon: number }>({ lat: 12.8230, lon: 80.0440 });

  const fetchWeatherData = async (lat = 12.8230, lon = 80.0440) => {
    const apiKey = sessionStorage.getItem("agrisense_weather_key") || import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "your_openweathermap_api_key_here") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMsg("");

    try {
      // Current Weather
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      if (!currentRes.ok) {
        const errData = await currentRes.json();
        throw new Error(errData.message || "Weather check failed.");
      }
      const currentData = await currentRes.json();

      // Forecast (every 3 hours)
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const forecastData = await forecastRes.json();

      const newCurrent = {
        locationName: currentData.name,
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        condition: currentData.weather[0].main,
        icon: getIcon(currentData.weather[0].icon),
        humidity: currentData.main.humidity,
        wind: Math.round(currentData.wind.speed * 3.6),
        visibility: currentData.visibility / 1000,
        pressure: currentData.main.pressure,
        rain: currentData.rain?.["1h"] || 0,
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newHourly = forecastData.list.slice(0, 6).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
        icon: getIcon(item.weather[0].icon),
        temp: Math.round(item.main.temp),
      }));

      const newWeekly = forecastData.list.filter((_: any, i: number) => i % 8 === 0).map((item: any) => ({
        day: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'long' }),
        icon: getIcon(item.weather[0].icon),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        rain: Math.round(item.pop * 100),
        condition: item.weather[0].main,
      }));

      // Dynamic alerts
      const newAlerts = [];
      if (newCurrent.humidity > 80) newAlerts.push({ type: "warning", text: "High humidity detected — increased risk of fungal growth in crops." });
      if (newWeekly[0].rain > 50) newAlerts.push({ type: "warning", text: "Heavy rain forecast — avoid open-field harvesting this week." });
      if (newCurrent.temp > 35) newAlerts.push({ type: "info", text: "High heat alert — ensure irrigation systems are active during early morning." });
      if (newAlerts.length === 0) newAlerts.push({ type: "success", text: "Stable weather conditions — ideal for general field maintenance." });

      setCurrent(newCurrent);
      setHourly(newHourly);
      setWeekly(newWeekly);
      setAlerts(newAlerts);
    } catch (err: any) {
      console.error("Weather fetch failed:", err);
      setError(true);
      setErrorMsg(err.message || "Failed to sync with weather satellites. Check your API key and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
        setCoords(newCoords);
        fetchWeatherData(newCoords.lat, newCoords.lon);
      }, (error) => {
        console.warn("Geolocation denied, using default:", error);
        fetchWeatherData();
      });
    } else {
      fetchWeatherData();
    }
  }, []);

  const mockData = {
    current: {
      locationName: "Kattankulathur",
      temp: 28,
      feelsLike: 30,
      condition: "Partly Cloudy",
      icon: CloudSun,
      humidity: 65,
      wind: 12,
      visibility: 10,
      pressure: 1013,
      rain: 20,
      sunrise: "5:42 AM",
      sunset: "6:38 PM",
    },
    hourly: [
      { time: "Now", icon: CloudSun, temp: 28 },
      { time: "2 PM", icon: Sun, temp: 31 },
      { time: "4 PM", icon: Sun, temp: 30 },
      { time: "6 PM", icon: CloudSun, temp: 27 },
      { time: "8 PM", icon: Cloud, temp: 24 },
      { time: "10 PM", icon: Cloud, temp: 22 },
    ],
    weekly: [
      { day: "Monday", icon: Sun, high: 31, low: 22, rain: 5, condition: "Sunny" },
      { day: "Tuesday", icon: CloudSun, high: 29, low: 21, rain: 15, condition: "Partly Cloudy" },
      { day: "Wednesday", icon: Cloud, high: 26, low: 20, rain: 40, condition: "Overcast" },
      { day: "Thursday", icon: CloudRain, high: 23, low: 19, rain: 80, condition: "Heavy Rain" },
      { day: "Friday", icon: CloudDrizzle, high: 22, low: 18, rain: 65, condition: "Drizzle" },
      { day: "Saturday", icon: CloudSun, high: 27, low: 20, rain: 20, condition: "Clearing Up" },
      { day: "Sunday", icon: Sun, high: 30, low: 22, rain: 5, condition: "Sunny" },
    ],
    alerts: [
      { type: "warning", text: "Heavy rainfall expected Thursday — delay pesticide application" },
      { type: "info", text: "Good conditions for planting rice seedlings this weekend" },
      { type: "success", text: "Optimal watering conditions until Wednesday morning" },
    ]
  };

  const displayCurrent = current || mockData.current;
  const displayHourly = hourly.length > 0 ? hourly : mockData.hourly;
  const displayWeekly = weekly.length > 0 ? weekly : mockData.weekly;
  const displayAlerts = alerts.length > 0 ? alerts : mockData.alerts;

  const alertStyles: any = {
    warning: "bg-warning/10 border-warning/20 text-warning",
    info: "bg-info/10 border-info/20 text-info",
    success: "bg-success/10 border-success/20 text-success",
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 anim-enter">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 text-destructive">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-bold text-destructive mb-1">Live Sync Error</p>
            <p className="text-xs text-destructive/80 leading-relaxed font-medium">{errorMsg}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold"
            onClick={() => fetchWeatherData(coords.lat, coords.lon)}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {(!sessionStorage.getItem("agrisense_weather_key") && !import.meta.env.VITE_OPENWEATHER_API_KEY) && (
        <div className="bg-info/10 border border-info/20 p-4 rounded-2xl flex items-center gap-4 anim-enter">
          <AlertTriangle className="w-5 h-5 text-info flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-info">Weather Demo Mode</p>
            <p className="text-xs text-info/80">No API key detected. Using sample data. Enter your OpenWeather key in Profile settings to enable real-time local updates.</p>
          </div>
        </div>
      )}
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg">
          Real-time weather data and farming-specific alerts for your location in {displayCurrent.locationName || "your area"}.
        </p>
      </div>

      {/* Current weather hero */}
      <div className="surface gradient-hero rounded-2xl overflow-hidden anim-enter anim-enter-delay-1">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <displayCurrent.icon className="w-20 h-20 text-primary-foreground/80" />
              <div>
                <p className="text-5xl font-bold text-primary-foreground font-body">{displayCurrent.temp}°C</p>
                <p className="text-primary-foreground/70 mt-1">{displayCurrent.condition}</p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">Feels like {displayCurrent.feelsLike}°C</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              {[
                { icon: Droplets, label: "Humidity", value: `${displayCurrent.humidity}%` },
                { icon: Wind, label: "Wind", value: `${displayCurrent.wind} km/h` },
                { icon: CloudRain, label: "Rain (1h)", value: `${displayCurrent.rain}mm` },
                { icon: Eye, label: "Visibility", value: `${displayCurrent.visibility} km` },
                { icon: Gauge, label: "Pressure", value: `${displayCurrent.pressure} hPa` },
                { icon: Thermometer, label: "Sunrise", value: `${displayCurrent.sunrise}` },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <m.icon className="w-4 h-4 mx-auto mb-1 text-primary-foreground/60" />
                  <p className="text-sm font-semibold text-primary-foreground">{m.value}</p>
                  <p className="text-[10px] text-primary-foreground/50">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-foreground/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-primary-foreground/70 font-bold uppercase tracking-widest">Local Outlook Forecast</p>
              <p className="text-[10px] text-primary-foreground/40 italic">Aggregated from OpenWeatherMap</p>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
              {displayHourly.map((h, i) => (
                <div key={i} className="text-center flex-shrink-0 px-4 py-3 rounded-2xl bg-primary-foreground/[0.08] backdrop-blur-sm min-w-[85px] border border-primary-foreground/5 hover:bg-primary-foreground/[0.12] transition-colors">
                  <p className="text-[11px] text-primary-foreground/70 mb-2 font-medium">{h.time}</p>
                  <h.icon className="w-7 h-7 mx-auto mb-2 text-primary-foreground/90" />
                  <p className="text-base font-bold text-primary-foreground">{h.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-day forecast */}
        <div className="lg:col-span-2 surface p-6 shadow-sm anim-enter anim-enter-delay-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl text-foreground font-semibold">Weekly Outlook</h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Next 5 Days</span>
          </div>
          <div className="space-y-1">
            {displayWeekly.map((day, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group">
                <span className="text-sm font-semibold text-foreground w-28 group-hover:text-primary transition-colors">{day.day}</span>
                <div className="flex-1 flex items-center gap-4">
                  <day.icon className="w-6 h-6 text-primary/70 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-muted-foreground hidden sm:block">{day.condition}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 min-w-[60px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-info" />
                    <span className="text-xs font-bold text-info/90">{day.rain}%</span>
                  </div>
                  <div className="text-sm text-right w-24">
                    <span className="font-bold text-foreground inline-block w-8 text-center">{day.high}°</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-muted-foreground font-medium inline-block w-8 text-center">{day.low}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farm alerts */}
        <div className="surface p-6 shadow-sm anim-enter anim-enter-delay-3 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h3 className="font-heading text-xl text-foreground font-semibold">Agricultural Risks</h3>
          </div>
          <div className="space-y-4 flex-1">
            {displayAlerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-2xl border-l-[4px] shadow-sm transition-transform hover:translate-x-1 ${alertStyles[alert.type]}`}>
                <div className="flex items-start gap-3">
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  {alert.type === 'info' && <Leaf className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <p className="text-xs font-medium leading-relaxed">{alert.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-muted/30 border border-muted flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Astronomy</span>
              <CloudSun className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="flex justify-between items-center px-2">
              <div className="text-center group">
                <p className="text-xl mb-1 group-hover:scale-110 transition-transform">🌅</p>
                <p className="text-xs font-bold text-foreground">{displayCurrent.sunrise}</p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5">Sunrise</p>
              </div>
              <div className="h-8 w-px bg-muted-foreground/10" />
              <div className="text-center group">
                <p className="text-xl mb-1 group-hover:scale-110 transition-transform">🌇</p>
                <p className="text-xs font-bold text-foreground">{displayCurrent.sunset}</p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5">Sunset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Weather;
