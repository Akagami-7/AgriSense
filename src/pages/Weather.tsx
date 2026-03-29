import { Sun, Cloud, CloudRain, Droplets, Wind, Thermometer, CloudSun, Eye, Gauge, CloudDrizzle, Snowflake } from "lucide-react";

const current = {
  temp: 28,
  feelsLike: 30,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: 12,
  visibility: 10,
  pressure: 1013,
  uv: 6,
  dewPoint: 20,
  rain: 20,
  sunrise: "5:42 AM",
  sunset: "6:38 PM",
};

const hourly = [
  { time: "Now", icon: CloudSun, temp: 28 },
  { time: "2 PM", icon: Sun, temp: 31 },
  { time: "4 PM", icon: Sun, temp: 30 },
  { time: "6 PM", icon: CloudSun, temp: 27 },
  { time: "8 PM", icon: Cloud, temp: 24 },
  { time: "10 PM", icon: Cloud, temp: 22 },
];

const weekly = [
  { day: "Monday", icon: Sun, high: 31, low: 22, rain: 5, condition: "Sunny" },
  { day: "Tuesday", icon: CloudSun, high: 29, low: 21, rain: 15, condition: "Partly Cloudy" },
  { day: "Wednesday", icon: Cloud, high: 26, low: 20, rain: 40, condition: "Overcast" },
  { day: "Thursday", icon: CloudRain, high: 23, low: 19, rain: 80, condition: "Heavy Rain" },
  { day: "Friday", icon: CloudDrizzle, high: 22, low: 18, rain: 65, condition: "Drizzle" },
  { day: "Saturday", icon: CloudSun, high: 27, low: 20, rain: 20, condition: "Clearing Up" },
  { day: "Sunday", icon: Sun, high: 30, low: 22, rain: 5, condition: "Sunny" },
];

const farmAlerts = [
  { type: "warning" as const, text: "Heavy rainfall expected Thursday — delay any pesticide application" },
  { type: "info" as const, text: "Good conditions for planting rice seedlings this weekend" },
  { type: "success" as const, text: "Optimal watering conditions until Wednesday morning" },
];

const Weather = () => {
  const alertStyles = {
    warning: "bg-warning/10 border-warning/20 text-warning",
    info: "bg-info/10 border-info/20 text-info",
    success: "bg-success/10 border-success/20 text-success",
  };

  return (
    <div className="space-y-6">
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg">
          Real-time weather data and farming-specific alerts for your location in Kattankulathur, Tamil Nadu.
        </p>
      </div>

      {/* Current weather hero */}
      <div className="surface gradient-hero rounded-2xl overflow-hidden anim-enter anim-enter-delay-1">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <CloudSun className="w-20 h-20 text-primary-foreground/80" />
              <div>
                <p className="text-5xl font-bold text-primary-foreground font-body">{current.temp}°C</p>
                <p className="text-primary-foreground/70 mt-1">{current.condition}</p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">Feels like {current.feelsLike}°C</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              {[
                { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
                { icon: Wind, label: "Wind", value: `${current.wind} km/h` },
                { icon: CloudRain, label: "Rain Chance", value: `${current.rain}%` },
                { icon: Eye, label: "Visibility", value: `${current.visibility} km` },
                { icon: Gauge, label: "Pressure", value: `${current.pressure} hPa` },
                { icon: Thermometer, label: "Dew Point", value: `${current.dewPoint}°C` },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <m.icon className="w-4 h-4 mx-auto mb-1 text-primary-foreground/60" />
                  <p className="text-sm font-semibold text-primary-foreground">{m.value}</p>
                  <p className="text-[10px] text-primary-foreground/50">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly */}
          <div className="mt-6 pt-6 border-t border-primary-foreground/10">
            <p className="text-xs text-primary-foreground/50 mb-3 font-medium uppercase tracking-wider">Today's Forecast</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {hourly.map((h) => (
                <div key={h.time} className="text-center flex-shrink-0 px-3 py-2 rounded-xl bg-primary-foreground/5 min-w-[70px]">
                  <p className="text-[11px] text-primary-foreground/60 mb-2">{h.time}</p>
                  <h.icon className="w-6 h-6 mx-auto mb-2 text-primary-foreground/70" />
                  <p className="text-sm font-bold text-primary-foreground">{h.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-day forecast */}
        <div className="lg:col-span-2 surface p-6 anim-enter anim-enter-delay-2">
          <h3 className="font-heading text-lg text-foreground mb-4">7-Day Forecast</h3>
          <div className="space-y-3">
            {weekly.map((day) => (
              <div key={day.day} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                <span className="text-sm font-medium text-foreground w-24">{day.day}</span>
                <day.icon className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-xs text-muted-foreground flex-1">{day.condition}</span>
                <span className="text-xs text-info">{day.rain}% 🌧</span>
                <div className="text-sm text-right w-20">
                  <span className="font-semibold text-foreground">{day.high}°</span>
                  <span className="text-muted-foreground"> / {day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farm alerts */}
        <div className="surface p-6 anim-enter anim-enter-delay-3">
          <h3 className="font-heading text-lg text-foreground mb-4">Farm Alerts</h3>
          <div className="space-y-3">
            {farmAlerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-xl border text-sm ${alertStyles[alert.type]}`}>
                {alert.text}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl surface-inset">
            <p className="text-xs font-medium text-foreground mb-2">Sun Schedule</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">🌅 {current.sunrise}</span>
              <span className="text-muted-foreground">🌇 {current.sunset}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
