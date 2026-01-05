export type ExpandableItem = {
    name: string;
    parentId: string | null;
    isExpanded: boolean;
    hasChildren: boolean;
    mainId: string;
}