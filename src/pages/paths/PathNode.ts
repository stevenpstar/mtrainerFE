type TPathNode = {
  ID: string;
  Column: number;
  Row: number;
  Label: string;
  Link: string;
  Spacer: boolean;
  Branch: boolean;
};

type TPathTree = {
  Columns: number;
  Rows: number;
  PathNodes: TPathNode[];
};

export { type TPathNode, type TPathTree };
