# TabItem
> id: string | component: "TabItem" | props: object

## props (required: `key`)
- `key`: string | DataBinding — TabPane's key.
- `label?`: string | DataBinding — Tab header text element.
- `icon?`: string | DataBinding — Tab header icon (Lucide icon name in kebab-case, e.g., 'chevron-right')
- `disabled?`: boolean | DataBinding
- `closable?`: boolean | DataBinding — Whether the tab shows a close icon and can be removed.
- `content?`: string | DataBinding | SlotNode — Component payload. Can be raw literal text OR a structural node reference.
