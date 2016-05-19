
export interface IContextualMenuItem {
  title: string;
  state: string;
}

export interface IContextualMenu {
  items: Array<IContextualMenuItem>;
  state?: string;
}
