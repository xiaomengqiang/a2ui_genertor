# Component Patterns

## React Component Conventions

### File Structure
Every generated component file follows this structure:

```tsx
// 1. Imports
import { useState } from "react";
import { Search, Bell, Settings } from "lucide-react";

// 2. Type definitions
interface ComponentProps { ... }
interface ComponentData { ... }

// 3. Mock data
const mockData: ComponentData = { ... };

// 4. Sub-components (if any)
function SubItem({ ... }: SubItemProps) { ... }

// 5. Main component (default export)
export default function ComponentName({ ... }: ComponentProps) {
  // hooks
  const [state, setState] = useState(false);
  
  // render
  return ( ... );
}
```

### Props Pattern
```tsx
interface UserCardProps {
  name?: string;
  avatar?: string;
  role?: "admin" | "user" | "guest";
  onFollow?: (id: string) => void;
}
```

### State Management
- Use `useState` for local interactive state
- Keep state minimal — only what affects the UI
- Prefer derived values over stored state

```tsx
const [isFollowing, setIsFollowing] = useState(false);
const [selectedTab, setSelectedTab] = useState("overview");
const [searchQuery, setSearchQuery] = useState("");
```

### Conditional Rendering
```tsx
// Boolean
{isLoading && <Spinner />}

// Ternary
{isEmpty ? <EmptyState /> : <DataList items={items} />}

// Complex conditions
{status === "success" && <SuccessView />}
{status === "error" && <ErrorView />}
{status === "loading" && <LoadingView />}
```

### List Rendering
```tsx
{items.map((item) => (
  <div key={item.id} className="...">
    {item.name}
  </div>
))}
```

### Event Handlers
```tsx
const handleClick = () => { ... };
const handleToggle = () => setIsOpen(!isOpen);
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};
```

## Common UI Patterns

### Card Container
```tsx
<div className="rounded-lg bg-white p-6 shadow-card">
  {/* header */}
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">Title</h3>
    <button className="text-on-surface-variant hover:text-on-surface">
      <MoreHorizontal className="h-5 w-5" />
    </button>
  </div>
  {/* body */}
  <div className="mt-4">...</div>
</div>
```

### Stat Card
```tsx
<div className="rounded-lg bg-white p-5 shadow-card">
  <div className="flex items-center justify-between">
    <span className="text-sm text-on-surface-variant">Label</span>
    <Icon className="h-5 w-5 text-primary" />
  </div>
  <p className="mt-2 text-3xl font-bold">12,345</p>
  <p className="mt-1 text-xs text-success">+12.5% vs last week</p>
</div>
```

### Button Variants
```tsx
// Primary
<button className="rounded-action bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
  Action
</button>

// Secondary / Ghost
<button className="rounded-action bg-surface px-4 py-2 text-sm font-medium text-on-surface hover:bg-outline/20 transition-colors">
  Cancel
</button>

// Icon button
<button className="rounded-full p-2 text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors">
  <Bell className="h-5 w-5" />
</button>
```

### Tag / Badge
```tsx
// Status badge
<span className="rounded-badge bg-success-container px-3 py-1 text-xs font-medium text-success">
  Active
</span>

// Neutral tag
<span className="rounded-badge bg-surface px-3 py-1 text-xs font-medium text-on-surface-variant">
  Tag
</span>
```

### Input Field
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-placeholder" />
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full rounded-md border border-outline bg-white py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
  />
</div>
```

### Tab Navigation
```tsx
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

<div className="flex gap-1 border-b border-divider">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setSelectedTab(tab.id)}
      className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
        selectedTab === tab.id
          ? "border-primary text-primary"
          : "border-transparent text-on-surface-variant hover:text-on-surface"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### Progress Bar
```tsx
<div className="h-2 w-full rounded-full bg-surface">
  <div
    className="h-2 rounded-full bg-primary transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Avatar
```tsx
<img
  src="https://randomuser.me/api/portraits/men/32.jpg"
  alt="User"
  className="h-10 w-10 rounded-full object-cover"
/>
```

### Tooltip (CSS-based)
```tsx
<div className="group relative">
  <button className="...">Hover me</button>
  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-on-surface px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
    Tooltip text
  </span>
</div>
```

### Modal / Dialog
```tsx
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
    <div className="relative w-96 rounded-xl bg-white p-6 shadow-modal">
      <h3 className="text-lg font-semibold">Dialog Title</h3>
      <p className="mt-2 text-sm text-on-surface-variant">Content here</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={() => setIsOpen(false)} className="...">Cancel</button>
        <button onClick={() => setIsOpen(false)} className="...">Confirm</button>
      </div>
    </div>
  </div>
)}
```

### Table
```tsx
<div className="overflow-hidden rounded-lg border border-outline">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-surface text-left text-on-surface-variant">
        <th className="px-4 py-3 font-medium">Name</th>
        <th className="px-4 py-3 font-medium">Status</th>
        <th className="px-4 py-3 font-medium">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-divider">
      {rows.map((row) => (
        <tr key={row.id} className="hover:bg-surface/50">
          <td className="px-4 py-3">{row.name}</td>
          <td className="px-4 py-3">{row.status}</td>
          <td className="px-4 py-3">{row.action}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <Inbox className="h-12 w-12 text-content-placeholder" />
  <p className="mt-4 text-sm text-on-surface-variant">No items found</p>
</div>
```
