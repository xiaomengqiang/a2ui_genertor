# Example Components

## Example 1: User Profile Card

```tsx
import { useState } from "react";
import { Heart, Share2, MoreHorizontal, MapPin, Calendar, CheckCircle2 } from "lucide-react";

interface UserCardProps {
  name?: string;
  avatar?: string;
}

interface UserCardData {
  name: string;
  avatar: string;
  title: string;
  bio: string;
  location: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  tags: string[];
}

const mockData: UserCardData = {
  name: "Alex Chen",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  title: "Senior Frontend Engineer",
  bio: "Open source enthusiast · React expert · Design system advocate.",
  location: "Shanghai, China",
  joinDate: "Joined March 2021",
  followers: 1280,
  following: 324,
  posts: 89,
  tags: ["React", "TypeScript", "Tailwind", "Node.js"],
};

export default function UserCard({}: UserCardProps = {}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const data = mockData;

  return (
    <div className="w-96 rounded-xl bg-white p-6 shadow-card transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={data.avatar} alt={data.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary ring-offset-2" />
          <div>
            <h3 className="text-lg font-semibold text-on-surface">{data.name}</h3>
            <p className="text-sm text-on-surface-variant">{data.title}</p>
          </div>
        </div>
        <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface hover:text-on-surface">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{data.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span key={tag} className="rounded-badge bg-primary-light px-3 py-1 text-xs font-medium text-primary">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{data.location}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{data.joinDate}</span>
      </div>
      <div className="mt-5 flex items-center gap-6 border-t border-divider pt-4">
        <div className="text-center">
          <span className="block text-lg font-bold text-on-surface">{data.posts}</span>
          <span className="text-xs text-on-surface-variant">Posts</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-on-surface">{data.followers}</span>
          <span className="text-xs text-on-surface-variant">Followers</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-on-surface">{data.following}</span>
          <span className="text-xs text-on-surface-variant">Following</span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex-1 rounded-action px-4 py-2 text-sm font-medium transition-all ${isFollowing ? "bg-surface text-on-surface" : "bg-primary text-white hover:bg-primary-hover"}`}
        >
          {isFollowing ? <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="h-4 w-4" />Following</span> : "Follow"}
        </button>
        <button onClick={() => setLiked(!liked)} className={`rounded-action p-2 transition-colors ${liked ? "bg-error/10 text-error" : "bg-surface text-on-surface-variant hover:text-on-surface"}`}>
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        </button>
        <button className="rounded-action bg-surface p-2 text-on-surface-variant hover:text-on-surface">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

## Example 2: Statistics Dashboard Panel

```tsx
import { useState } from "react";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatItem {
  label: string;
  value: string;
  change: number;
  icon: "users" | "cart" | "dollar" | "activity";
  trend: { month: string; value: number }[];
}

const stats: StatItem[] = [
  { label: "Total Users", value: "48,293", change: 12.5, icon: "users", trend: [{ month: "Jan", value: 4200 }, { month: "Feb", value: 3800 }, { month: "Mar", value: 5300 }, { month: "Apr", value: 4780 }, { month: "May", value: 6890 }, { month: "Jun", value: 5390 }] },
  { label: "Orders", value: "2,847", change: 8.3, icon: "cart", trend: [{ month: "Jan", value: 320 }, { month: "Feb", value: 280 }, { month: "Mar", value: 450 }, { month: "Apr", value: 390 }, { month: "May", value: 520 }, { month: "Jun", value: 480 }] },
  { label: "Revenue", value: "$94,820", change: -2.1, icon: "dollar", trend: [{ month: "Jan", value: 16000 }, { month: "Feb", value: 14000 }, { month: "Mar", value: 18500 }, { month: "Apr", value: 17200 }, { month: "May", value: 16800 }, { month: "Jun", value: 15300 }] },
  { label: "Active Rate", value: "73.2%", change: 5.7, icon: "activity", trend: [{ month: "Jan", value: 62 }, { month: "Feb", value: 65 }, { month: "Mar", value: 68 }, { month: "Apr", value: 70 }, { month: "May", value: 71 }, { month: "Jun", value: 73 }] },
];

const iconMap = { users: Users, cart: ShoppingCart, dollar: DollarSign, activity: Activity };

export default function StatsDashboard() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = iconMap[stat.icon];
          const isPositive = stat.change >= 0;
          return (
            <button
              key={stat.label}
              onClick={() => setSelected(idx)}
              className={`rounded-lg bg-white p-5 text-left shadow-card transition-all hover:shadow-md ${selected === idx ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">{stat.label}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-3xl font-bold text-on-surface">{stat.value}</p>
              <div className="mt-1 flex items-center gap-1">
                {isPositive ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : <TrendingDown className="h-3.5 w-3.5 text-error" />}
                <span className={`text-xs font-medium ${isPositive ? "text-success" : "text-error"}`}>
                  {isPositive ? "+" : ""}{stat.change}%
                </span>
                <span className="text-xs text-on-surface-variant">vs last month</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-on-surface">{stats[selected].label} Trend</h3>
        <div className="mt-4" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats[selected].trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFDFDF" />
              <XAxis dataKey="month" stroke="#777777" fontSize={12} />
              <YAxis stroke="#777777" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0067D1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

## Example 3: Login Form

```tsx
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="w-96 rounded-xl bg-white p-8 shadow-lg">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-on-surface">Welcome back</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-placeholder" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-outline bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-placeholder" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-outline bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-placeholder hover:text-on-surface"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-primary hover:text-primary-hover">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-action bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-divider" />
        <span className="text-xs text-on-surface-variant">OR</span>
        <div className="h-px flex-1 bg-divider" />
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-action border border-outline bg-white px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface">
        <Github className="h-5 w-5" />
        Continue with GitHub
      </button>
    </div>
  );
}
```

## Example 4: Task List (Kanban Column)

```tsx
import { useState } from "react";
import { Plus, MoreHorizontal, Calendar, Paperclip, MessageSquare, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignees: string[];
  tags: string[];
  comments: number;
  attachments: number;
  subtasks: { total: number; done: number };
}

const tasks: Task[] = [
  { id: "t1", title: "Refactor auth module", description: "Migrate to new token system and update middleware", priority: "high", dueDate: "Aug 26", assignees: ["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/22.jpg"], tags: ["backend", "auth"], comments: 5, attachments: 2, subtasks: { total: 6, done: 3 } },
  { id: "t2", title: "Design dashboard mockup", description: "Create high-fidelity mockups for the new analytics dashboard", priority: "medium", dueDate: "Aug 28", assignees: ["https://randomuser.me/api/portraits/women/68.jpg"], tags: ["design", "ui"], comments: 2, attachments: 4, subtasks: { total: 3, done: 1 } },
  { id: "t3", title: "Fix mobile nav z-index", description: "Navigation overlay appears behind sticky header on iOS Safari", priority: "low", dueDate: "Aug 30", assignees: ["https://randomuser.me/api/portraits/men/55.jpg", "https://randomuser.me/api/portraits/women/12.jpg", "https://randomuser.me/api/portraits/men/78.jpg"], tags: ["bug", "mobile"], comments: 8, attachments: 1, subtasks: { total: 2, done: 2 } },
  { id: "t4", title: "Write API documentation", description: "Document all endpoints for the v2 REST API including examples", priority: "medium", dueDate: "Sep 02", assignees: ["https://randomuser.me/api/portraits/women/33.jpg"], tags: ["docs", "api"], comments: 0, attachments: 0, subtasks: { total: 4, done: 0 } },
];

const priorityConfig = {
  high: { color: "text-error", bg: "bg-error-container", label: "High" },
  medium: { color: "text-critical", bg: "bg-critical-container", label: "Medium" },
  low: { color: "text-success", bg: "bg-success-container", label: "Low" },
};

export default function TaskList() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex h-full w-80 flex-col rounded-lg bg-surface/50 p-3">
      <div className="flex items-center justify-between px-2 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-on-surface">In Progress</h3>
          <span className="rounded-badge bg-surface px-2 py-0.5 text-xs text-on-surface-variant">{tasks.length}</span>
        </div>
        <button className="rounded-full p-1 text-on-surface-variant hover:bg-surface hover:text-on-surface">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task) => {
          const p = priorityConfig[task.priority];
          const progress = Math.round((task.subtasks.done / task.subtasks.total) * 100);
          return (
            <div key={task.id} className="cursor-pointer rounded-lg bg-white p-3 shadow-card transition-all hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <span className={`rounded-badge ${p.bg} px-2 py-0.5 text-xs font-medium ${p.color}`}>{p.label}</span>
                <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <Calendar className="h-3 w-3" />
                  {task.dueDate}
                </span>
              </div>
              <h4 className="text-sm font-medium text-on-surface">{task.title}</h4>
              <p className="mt-1 text-xs text-on-surface-variant">{task.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-badge bg-surface px-2 py-0.5 text-xs text-on-surface-variant">#{tag}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {task.assignees.map((src, i) => (
                    <img key={i} src={src} alt="" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  {task.subtasks.total > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {task.subtasks.done}/{task.subtasks.total}
                    </span>
                  )}
                  {task.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {task.comments}
                    </span>
                  )}
                  {task.attachments > 0 && (
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {task.attachments}
                    </span>
                  )}
                </div>
              </div>
              {task.subtasks.total > 0 && (
                <div className="mt-2 h-1 w-full rounded-full bg-surface">
                  <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNew ? (
        <input
          autoFocus
          placeholder="Enter task title..."
          onBlur={() => setShowNew(false)}
          className="mt-2 rounded-md border border-primary bg-white p-2 text-sm outline-none"
        />
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface hover:text-on-surface"
        >
          <Plus className="h-4 w-4" />
          Add task
        </button>
      )}
    </div>
  );
}
```

## Example 5: Data Table with Status

```tsx
import { useState } from "react";
import { Search, Filter, Download, ChevronDown, MoreHorizontal } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  avatar: string;
  product: string;
  date: string;
  amount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const orders: Order[] = [
  { id: "ORD-001", customer: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg", product: "MacBook Pro 16", date: "2026-08-20", amount: "$2,399", status: "completed" },
  { id: "ORD-002", customer: "Mike Davis", avatar: "https://randomuser.me/api/portraits/men/32.jpg", product: "iPhone 16 Pro", date: "2026-08-21", amount: "$1,199", status: "processing" },
  { id: "ORD-003", customer: "Emma Wilson", avatar: "https://randomuser.me/api/portraits/women/68.jpg", product: "iPad Air", date: "2026-08-22", amount: "$599", status: "pending" },
  { id: "ORD-004", customer: "James Brown", avatar: "https://randomuser.me/api/portraits/men/55.jpg", product: "Apple Watch S10", date: "2026-08-22", amount: "$399", status: "completed" },
  { id: "ORD-005", customer: "Lisa Anderson", avatar: "https://randomuser.me/api/portraits/women/12.jpg", product: "AirPods Pro 2", date: "2026-08-23", amount: "$249", status: "cancelled" },
  { id: "ORD-006", customer: "Tom Smith", avatar: "https://randomuser.me/api/portraits/men/78.jpg", product: "MacBook Air M3", date: "2026-08-23", amount: "$1,099", status: "processing" },
  { id: "ORD-007", customer: "Nancy White", avatar: "https://randomuser.me/api/portraits/women/33.jpg", product: "Magic Keyboard", date: "2026-08-24", amount: "$99", status: "pending" },
];

const statusConfig = {
  pending: { color: "text-critical", bg: "bg-critical-container", dot: "bg-critical" },
  processing: { color: "text-info", bg: "bg-info-container", dot: "bg-info" },
  completed: { color: "text-success", bg: "bg-success-container", dot: "bg-success" },
  cancelled: { color: "text-error", bg: "bg-error-container", dot: "bg-error" },
};

export default function OrderTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = orders.filter(
    (o) =>
      (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || o.status === statusFilter)
  );

  return (
    <div className="w-full max-w-4xl rounded-lg bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-divider p-4">
        <div>
          <h3 className="text-lg font-semibold text-on-surface">Recent Orders</h3>
          <p className="text-xs text-on-surface-variant">{filtered.length} orders found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-placeholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-48 rounded-md border border-outline py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-outline bg-white py-2 pl-3 pr-8 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-action border border-outline px-3 py-2 text-sm text-on-surface hover:bg-surface">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface text-left text-on-surface-variant">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {filtered.map((order) => {
              const s = statusConfig[order.status];
              return (
                <tr key={order.id} className="transition-colors hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-primary">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={order.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                      <span className="font-medium text-on-surface">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{order.product}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{order.date}</td>
                  <td className="px-4 py-3 font-medium text-on-surface">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-badge ${s.bg} px-2.5 py-1 text-xs font-medium ${s.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-full p-1 text-on-surface-variant hover:bg-surface hover:text-on-surface">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-divider p-4">
        <p className="text-xs text-on-surface-variant">Showing 1-{filtered.length} of {orders.length}</p>
        <div className="flex items-center gap-2">
          <button className="rounded-action border border-outline px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface">Previous</button>
          <button className="rounded-action bg-primary px-3 py-1.5 text-sm text-white">1</button>
          <button className="rounded-action border border-outline px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface">2</button>
          <button className="rounded-action border border-outline px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface">Next</button>
        </div>
      </div>
    </div>
  );
}
```
