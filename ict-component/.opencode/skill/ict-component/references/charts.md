# Charts (Recharts) Usage

Import from `recharts`:

```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadialBarChart, RadialBar, Legend
} from "recharts";
```

## Key Rules

1. **Always wrap in `ResponsiveContainer`:** Charts must be responsive.
2. **Set explicit height:** Use `height={300}` on `ResponsiveContainer`.
3. **No external colors:** Use the color tokens from the design system or standard hex.
4. **Mock data:** Provide realistic, fluctuating data (not monotonic).
5. **Tooltip:** Always include `<Tooltip />` for interactivity.
6. **Chinese/English keys:** Use semantic keys in mock data (e.g. `month`, `value`, `revenue`).

## Line Chart

```tsx
const lineData = [
  { month: "Jan", revenue: 4200, cost: 2400 },
  { month: "Feb", revenue: 3800, cost: 1398 },
  { month: "Mar", revenue: 5300, cost: 3800 },
  { month: "Apr", revenue: 4780, cost: 3908 },
  { month: "May", revenue: 6890, cost: 4800 },
  { month: "Jun", revenue: 5390, cost: 3800 },
  { month: "Jul", revenue: 6490, cost: 4300 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={lineData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#DFDFDF" />
    <XAxis dataKey="month" stroke="#777777" fontSize={12} />
    <YAxis stroke="#777777" fontSize={12} />
    <Tooltip />
    <Line type="monotone" dataKey="revenue" stroke="#0067D1" strokeWidth={2} dot={{ r: 4 }} />
    <Line type="monotone" dataKey="cost" stroke="#09AA71" strokeWidth={2} dot={{ r: 4 }} />
  </LineChart>
</ResponsiveContainer>
```

## Bar Chart

```tsx
const barData = [
  { name: "Mon", visits: 4000 },
  { name: "Tue", visits: 3000 },
  { name: "Wed", visits: 5000 },
  { name: "Thu", visits: 2780 },
  { name: "Fri", visits: 8900 },
  { name: "Sat", visits: 4390 },
  { name: "Sun", visits: 3490 },
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={barData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#DFDFDF" />
    <XAxis dataKey="name" stroke="#777777" fontSize={12} />
    <YAxis stroke="#777777" fontSize={12} />
    <Tooltip />
    <Bar dataKey="visits" fill="#0067D1" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

## Pie Chart

```tsx
const pieData = [
  { name: "Desktop", value: 400, color: "#0067D1" },
  { name: "Mobile", value: 300, color: "#09AA71" },
  { name: "Tablet", value: 200, color: "#F4840C" },
  { name: "Other", value: 100, color: "#777777" },
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={pieData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label={(entry) => `${entry.name}: ${entry.value}`}
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

## Area Chart

```tsx
const areaData = [
  { time: "00:00", cpu: 45, memory: 60 },
  { time: "04:00", cpu: 30, memory: 45 },
  { time: "08:00", cpu: 65, memory: 72 },
  { time: "12:00", cpu: 82, memory: 85 },
  { time: "16:00", cpu: 70, memory: 78 },
  { time: "20:00", cpu: 55, memory: 65 },
  { time: "23:59", cpu: 40, memory: 50 },
];

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={areaData}>
    <defs>
      <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#0067D1" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#0067D1" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#09AA71" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#09AA71" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#DFDFDF" />
    <XAxis dataKey="time" stroke="#777777" fontSize={12} />
    <YAxis stroke="#777777" fontSize={12} />
    <Tooltip />
    <Area type="monotone" dataKey="cpu" stroke="#0067D1" fill="url(#cpuGradient)" strokeWidth={2} />
    <Area type="monotone" dataKey="memory" stroke="#09AA71" fill="url(#memGradient)" strokeWidth={2} />
  </AreaChart>
</ResponsiveContainer>
```

## Radial Bar (Gauge)

```tsx
const gaugeData = [{ name: "progress", value: 72, fill: "#0067D1" }];

<ResponsiveContainer width="100%" height={200}>
  <RadialBarChart
    innerRadius="70%"
    outerRadius="100%"
    data={gaugeData}
    startAngle={90}
    endAngle={-270}
  >
    <RadialBar dataKey="value" cornerRadius={10} fill="#0067D1" background={{ fill: "#F3F3F3" }} />
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-on-surface text-2xl font-bold">
      72%
    </text>
  </RadialBarChart>
</ResponsiveContainer>
```

## Chart Color Palette

| Usage | Color |
|-------|-------|
| Primary series | `#0067D1` |
| Success series | `#09AA71` |
| Warning series | `#F4840C` |
| Error series | `#E02128` |
| Info series | `#2070F3` |
| Neutral series | `#777777` |
| Series 6 | `#715AFB` |
| Series 7 | `#E61866` |

## Chart Design Rules

1. **Grid:** Use `strokeDasharray="3 3" stroke="#DFDFDF"` for subtle grid lines.
2. **Axis text:** `stroke="#777777" fontSize={12}` for readable but subtle labels.
3. **Tooltip:** Always include `<Tooltip />` — Recharts provides a default styled one.
4. **Responsive:** Always use `<ResponsiveContainer width="100%" height={300}>`.
5. **Data fluctuation:** Line/area data MUST fluctuate realistically — never flat or monotonic.
6. **Rounded bars:** Use `radius={[4, 4, 0, 0]}` for top-rounded bars.
7. **Gradients:** Use `<defs>` with `linearGradient` for area charts to add depth.
8. **Labels:** For pie charts, use `label` prop to show values. For bar/line, the tooltip suffices.
