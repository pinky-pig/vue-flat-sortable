export interface FlatSortableProps {
  dir?: boolean
  modal?: boolean
}

export type FlatSortableEmits = {
  'update:open': [value: boolean]
}

export interface FlatSortableContentProps {
  direction?: 'row' | 'column'
  gap?: number
}
export type FlatSortableContentEmits = FlatSortableEmits

export interface FlatSortableItemProps {
}

export type FlatSortableItemEmits = {
  'select': [event: Event]
}
