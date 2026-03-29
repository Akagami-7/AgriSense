import { useState } from "react";
import { CalendarDays, Wrench, Droplets, FlaskConical, Sprout, Sun, Bug, Leaf, BookOpen, Clock, ChevronRight } from "lucide-react";

const categories = ["All Tips", "Watering & Irrigation", "Soil & Nutrients", "Pest Management", "Seasonal Planning"];

const featuredTips = [
  {
    icon: CalendarDays,
    title: "Plan Your Planting Calendar",
    desc: "Map out sowing and harvest dates based on your region's climate. Use a 3-season rotation plan to maximize soil nutrients and reduce pest cycles.",
    tag: "Planning",
    readTime: "3 min read",
  },
  {
    icon: Wrench,
    title: "Equipment Maintenance Guide",
    desc: "Schedule bi-weekly equipment checks. Clean spray nozzles after each use, sharpen blades monthly, and store machinery in dry conditions to prevent rust.",
    tag: "Equipment",
    readTime: "5 min read",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation Practices",
    desc: "Switch to drip irrigation to reduce water usage by up to 60%. Water during early morning (5–7 AM) to minimize evaporation and fungal growth risk.",
    tag: "Watering",
    readTime: "4 min read",
  },
  {
    icon: FlaskConical,
    title: "Soil Testing Protocol",
    desc: "Collect samples from 6–8 spots across your field at 15cm depth. Test pH, N-P-K levels, and organic matter content before every planting season.",
    tag: "Soil",
    readTime: "4 min read",
  },
];

const detailedTips: Record<string, Array<{ icon: typeof Sprout; title: string; tag: string; text: string; readTime: string }>> = {
  "All Tips": [
    { icon: Droplets, title: "Optimal Watering Schedule", tag: "Watering", readTime: "3 min", text: "Water your crops early in the morning (5–7 AM) to minimize evaporation. Use soil moisture sensors to determine when irrigation is actually needed rather than following a fixed schedule. Overwatering is just as harmful as underwatering — most crops prefer moist but well-drained soil." },
    { icon: FlaskConical, title: "Soil Health Management", tag: "Soil", readTime: "4 min", text: "Test soil pH every 6 months and maintain optimal levels (6.0–7.0 for most crops). Add organic compost at 2–3 tonnes per acre annually to improve soil structure, water retention, and microbial activity. Consider cover crops during fallow periods to prevent erosion." },
    { icon: Bug, title: "Integrated Pest Management", tag: "Pest Control", readTime: "5 min", text: "Use companion planting (e.g., marigolds with tomatoes) to naturally deter pests. Introduce beneficial insects like ladybugs for aphid control. Apply neem oil spray (5ml/L) as an organic pesticide. Chemical pesticides should be the last resort — always follow recommended dosages." },
    { icon: Leaf, title: "Crop Rotation Benefits", tag: "Planning", readTime: "3 min", text: "Rotate crops each season following a legume → cereal → root vegetable pattern. This prevents soil nutrient depletion, breaks pest and disease cycles, and can increase yields by 10–25% over monoculture farming." },
    { icon: Sun, title: "Heat Stress Prevention", tag: "Seasonal", readTime: "4 min", text: "During summer months (>35°C), use shade nets (50% density) for sensitive crops. Increase mulch thickness to 8–10cm to keep root zones cool. Consider heat-tolerant crop varieties for your region. Avoid transplanting during peak afternoon heat." },
    { icon: Sprout, title: "Seedling Care Best Practices", tag: "Growing", readTime: "3 min", text: "Harden off seedlings by gradually exposing them to outdoor conditions over 7–10 days before transplanting. Transplant during overcast days or late afternoon to reduce shock. Water immediately after transplanting and provide temporary shade for 2–3 days." },
  ],
  "Watering & Irrigation": [
    { icon: Droplets, title: "Drip Irrigation Setup Guide", tag: "Watering", readTime: "6 min", text: "Install drip lines 30cm apart for row crops. Use 2 L/hr emitters spaced every 30cm. Run the system for 30–45 minutes daily during summer, reducing to 20 minutes during cooler months. Check for clogs weekly and flush lines monthly." },
    { icon: Droplets, title: "Rainwater Harvesting", tag: "Watering", readTime: "4 min", text: "Collect rooftop runoff in storage tanks — a 100 sq.m roof can collect 60,000L annually in moderate rainfall areas. Use first-flush diverters to keep water clean. Stored rainwater is ideal for irrigation as it's naturally soft and chemical-free." },
  ],
  "Soil & Nutrients": [
    { icon: FlaskConical, title: "Understanding NPK Ratios", tag: "Soil", readTime: "5 min", text: "Nitrogen (N) promotes leaf growth, Phosphorus (P) supports root and flower development, and Potassium (K) strengthens overall plant health. A balanced 10-10-10 fertilizer works for most crops. Leafy vegetables need higher N, while fruiting crops need more P and K." },
    { icon: Leaf, title: "Composting Guide", tag: "Soil", readTime: "4 min", text: "Maintain a 3:1 ratio of brown (carbon) to green (nitrogen) materials. Turn the pile every 2 weeks for aeration. Compost is ready when it's dark, crumbly, and earthy-smelling — usually 3–6 months. Apply 5cm layer before planting season." },
  ],
  "Pest Management": [
    { icon: Bug, title: "Natural Pest Deterrents", tag: "Pest Control", readTime: "4 min", text: "Plant basil near tomatoes to repel whiteflies. Use garlic spray (crushed garlic in water, strained) to deter aphids. Install yellow sticky traps at canopy height for flying insects. Encourage birds with perching poles — a single bird can eat hundreds of insects daily." },
  ],
  "Seasonal Planning": [
    { icon: CalendarDays, title: "Monsoon Preparation Checklist", tag: "Seasonal", readTime: "5 min", text: "Clear drainage channels before monsoon season. Stake tall plants and provide windbreaks. Apply preventive fungicide 1 week before expected rains. Harvest mature crops early to prevent rain damage. Store seeds and equipment in waterproof containers." },
    { icon: Sun, title: "Summer Crop Selection", tag: "Seasonal", readTime: "3 min", text: "Choose drought-tolerant varieties: millets, sorghum, groundnut, and certain bean varieties thrive in summer heat. Use mulch generously and consider shade structures for sensitive crops like lettuce and spinach." },
  ],
};

const FarmingTips = () => {
  const [active, setActive] = useState("All Tips");

  const currentTips = detailedTips[active] || detailedTips["All Tips"];

  return (
    <div className="space-y-6">
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg">
          Evidence-based farming advice to help you grow healthier crops, improve soil quality, and maximize yields sustainably.
        </p>
      </div>

      {/* Featured tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 anim-enter anim-enter-delay-1">
        {featuredTips.map((tip) => (
          <div key={tip.title} className="surface-hover p-5 group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <tip.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="chip-neutral text-[10px] mb-2">{tip.tag}</span>
            <h4 className="font-semibold text-foreground text-sm mt-2 mb-1">{tip.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tip.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-[11px] text-primary font-medium">
              <Clock className="w-3 h-3" /> {tip.readTime}
            </div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 anim-enter anim-enter-delay-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              active === cat
                ? "gradient-earth text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips list */}
      <div className="space-y-4 anim-enter anim-enter-delay-3">
        {currentTips.map((tip) => (
          <div key={tip.title} className="surface-hover p-5 cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <tip.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{tip.title}</h4>
                  <span className="chip-neutral text-[10px]">{tip.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="w-3 h-3" /> {tip.readTime}</span>
                  <span className="flex items-center gap-1 text-[11px] text-primary font-medium group-hover:underline">
                    Read more <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmingTips;
