# Lucide Icons Reference

All icons are imported from `lucide-react`:

```tsx
import { Search, Bell, Settings } from "lucide-react";
```

## Common Icons by Category

### Navigation & Layout
`Menu`, `X`, `ChevronDown`, `ChevronRight`, `ChevronLeft`, `ChevronUp`, `ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`, `CornerDownLeft`, `Move`, `Maximize2`, `Minimize2`, `Expand`, `Shrink`, `PanelLeft`, `PanelRight`, `Sidebar`, `Columns`

### Actions & Operations
`Plus`, `Minus`, `Check`, `X`, `Search`, `Filter`, `Edit`, `Trash2`, `Copy`, `Clipboard`, `Download`, `Upload`, `Save`, `RefreshCw`, `RotateCw`, `RotateCcw`, `Undo2`, `Redo2`, `Power`, `ToggleLeft`, `ToggleRight`, `Sliders`, `Settings`, `Cog`, `Wrench`, `Tool`, `Command`, `Puzzle`

### Communication & Social
`Share2`, `Share`, `Link`, `Mail`, `Phone`, `MessageSquare`, `MessageCircle`, `Send`, `Reply`, `Forward`, `Bell`, `Megaphone`, `AtSign`, `Heart`, `ThumbsUp`, `ThumbsDown`, `Star`, `Award`, `Bookmark`, `Flag`, `Tag`, `Mention`

### User & People
`User`, `Users`, `UserPlus`, `UserMinus`, `UserCheck`, `UserX`, `UserCog`, `Contact`, `CircleUser`, `UserCircle`, `SquareUser`, `BadgeCheck`, `BadgeInfo`, `Fingerprint`, `ScanFace`, `IdCard`

### Media & Files
`Image`, `File`, `FileText`, `FilePlus`, `FileCheck`, `FileX`, `Folder`, `FolderOpen`, `FolderPlus`, `Files`, `Paperclip`, `FileImage`, `FileVideo`, `FileAudio`, `FileCode`, `FileSpreadsheet`, `FileArchive`, `Book`, `BookOpen`, `Notebook`, `NotebookPen`, `Note`, `StickyNote`

### Data & Charts
`BarChart`, `BarChart2`, `BarChart3`, `BarChart4`, `LineChart`, `PieChart`, `Activity`, `TrendingUp`, `TrendingDown`, `TrendingFlat`, `Minimize2`, `Sigma`, `Percent`, `Hash`, `Calculator`, `Database`, `Table`, `Sheet`, `Grid3x3`, `Grid2x2`, `LayoutGrid`, `List`, `ListOrdered`, `ListChecks`

### Status & Feedback
`CheckCircle`, `CheckCircle2`, `XCircle`, `AlertCircle`, `AlertTriangle`, `Info`, `HelpCircle`, `Help`, `Loader`, `Loader2`, `LoaderCircle`, `Clock`, `Timer`, `Hourglass`, `Zap`, `Sparkles`, `Wand`, `Wand2`, `WandSparkles`, `CircleCheck`, `CircleAlert`, `CircleX`, `CircleDashed`, `CircleDot`, `CircleSlash`, `Ban`, `Shield`, `ShieldCheck`, `ShieldAlert`, `Lock`, `Unlock`, `Key`, `KeyRound`

### E-commerce
`ShoppingCart`, `ShoppingBag`, `CreditCard`, `Wallet`, `DollarSign`, `Euro`, `PoundSterling`, `Yen`, `Receipt`, `Tag`, `Tags`, `Percent`, `Gift`, `Package`, `PackageOpen`, `PackageCheck`, `PackageX`, `Truck`, `Store`, `Coins`, `Banknote`, `Gem`

### UI Elements
`Eye`, `EyeOff`, `ZoomIn`, `ZoomOut`, `Maximize`, `Minimize`, `Expand`, `Shrink`, `Focus`, `Crosshair`, `MousePointer`, `MousePointer2`, `Hand`, `Pointer`, `Cursor`, `Square`, `Circle`, `Triangle`, `Hexagon`, `Octagon`, `Diamond`, `Dot`, `Circle`, `Box`, `Frame`, `Layers`, `Shapes`, `Component`, `Puzzle`

### Time & Date
`Calendar`, `CalendarDays`, `CalendarCheck`, `CalendarX`, `Clock`, `Timer`, `Hourglass`, `Watch`, `AlarmClock`, `CalendarClock`, `CalendarRange`, `CalendarSearch`, `Clock3`, `Clock4`, `Clock9`

### Location
`MapPin`, `MapPinned`, `Map`, `Globe`, `Compass`, `Navigation`, `Navigation2`, `Flag`, `Milestone`, `Pin`, `Locate`, `LocateFixed`, `Crosshair`, `Coordinate`

### Development & Code
`Code`, `Code2`, `Terminal`, `GitBranch`, `GitCommit`, `GitMerge`, `GitPullRequest`, `Github`, `Gitlab`, `Bug`, `Play`, `Pause`, `SkipForward`, `SkipBack`, `FastForward`, `Rewind`, `Stop`, `Record`, `CircleStop`, `CirclePlay`, `CirclePause`

### Content & Editor
`Bold`, `Italic`, `Underline`, `Strikethrough`, `AlignLeft`, `AlignCenter`, `AlignRight`, `AlignJustify`, `List`, `ListOrdered`, `ListChecks`, `Indent`, `Outdent`, `Heading1`, `Heading2`, `Heading3`, `Quote`, `Code`, `Code2`, `Braces`, `Brackets`, `Parentheses`, `Link`, `Unlink`, `Image`, `ImagePlus`, `Video`, `Audio`, `Mic`, `MicOff`

### Layout & Organization
`Layout`, `LayoutDashboard`, `LayoutGrid`, `LayoutList`, `LayoutPanelTop`, `LayoutPanelLeft`, `LayoutTemplate`, `Columns`, `Rows`, `Rows2`, `Columns2`, `Columns3`, `Grid`, `Container`, `Square`, `RectangleHorizontal`, `RectangleVertical`, `PanelTop`, `PanelBottom`, `PanelLeft`, `PanelRight`

### Emoji-like
`Smile`, `Frown`, `Meh`, `ThumbsUp`, `ThumbsDown`, `Heart`, `Sparkles`, `PartyPopper`, `Trophy`, `Crown`, `Rocket`, `Fire`, `Zap`, `Star`, `Award`, `Medal`

## Icon Usage Rules

1. **Import only what you use:** `import { Search, Bell } from "lucide-react"`
2. **Size via className:** `<Search className="h-5 w-5" />` (default 24x24)
3. **Color via className:** `<Search className="h-5 w-5 text-primary" />`
4. **Stroke width:** Default is 2. Use `stroke-width={1.5}` for lighter feel if needed.
5. **PascalCase:** Icon names are PascalCase, multi-word names use the full name (e.g. `ChevronDown`, not `chevron-down`).
6. **Common sizes:** `h-3.5 w-3.5` (small), `h-4 w-4` (medium), `h-5 w-5` (standard), `h-6 w-6` (large), `h-8 w-8` (hero), `h-12 w-12` (empty state).
