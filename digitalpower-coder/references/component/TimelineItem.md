# TimelineItem
> id: string | component: "TimelineItem" | props: object

## props (required: `title`, `content`)
- `content`: string | DataBinding | SlotNode — Component payload. Can be raw literal text OR a structural node reference. 
- `title`: string | DataBinding | SlotNode — Title of the item. Can be raw literal text OR a structural node reference. 
- `icon?`: string | DataBinding — Valid kebab-case Lucide icon matching the context (e.g., 'chevron-right').
- `color?`: string | DataBinding — Semantic hex color matching context.
- `placement?`: "start" | "end" (default: "start") — Customizing the node position
- `className?`: string — Tailwind CSS classes for the component.
