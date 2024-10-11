import { useEffect, useState } from 'react';
import { TPathNode, TPathTree } from './PathNode';
import { PathNodeElem } from './PathNodeElem';

function FundamentalsTree() {
  const [tree, setTree] = useState<TPathTree>({ PathNodes: [], Columns: 0, Rows: 0 });
  const [grid, setGrid] = useState<Array<TPathNode[]>>([]);
  useEffect(() => {
    fetch("/FundamentalsTree.json")
      .then(res => res.json())
      .then(tree => {
        CreateGrid(tree as TPathTree);
        setTree(tree);
      })
  }, [])

  const CreateGrid = (tree: TPathTree): void => {
    const tempGrid: Array<TPathNode[]> = [];
    for (let row = 0; row < tree.Rows; row++) {
      tempGrid.push([]);
      for (let col = 0; col < tree.Columns; col++) {
        const node = tree.PathNodes.filter((n: TPathNode) => n.Row == row && n.Column == col);
        if (node.length > 0) {
          tempGrid[row].push(node[0]);
        } else {
          tempGrid[row].push({
            ID: "SPACER " + row + col,
            Column: col,
            Row: row,
            Label: "spacer",
            Link: "",
            Spacer: true,
            Branch: false,
          });
        }
      }
      //      tempGrid.push([...tree.PathNodes.filter((n: TPathNode) => n.Row === row)]);
    }
    setGrid(tempGrid);
  }

  const ConnectVertically = (node: TPathNode): boolean => {
    if (node.Spacer) { return false; }
    if (node.Row == tree.Rows - 1) { return false; }
    const nextNode = grid[node.Row + 1].filter((n: TPathNode) => n.Column == node.Column);
    if (!nextNode || nextNode[0].Spacer) { return false; }
    return true;
  }

  const ConnectHorizontally = (node: TPathNode): boolean => {
    if (node.Spacer) { return false; }
    if (node.Column == tree.Columns - 1) { return false; }
    const nextNode = grid[node.Row].filter((n: TPathNode) => n.Column == node.Column + 1);
    if (!nextNode || nextNode[0].Spacer) { return false; }
    return true;
  }

  return (
    <div className="bg-zinc-950 w-full h-full flex flex-row justify-center">
      <div className="flex flex-col justify-start">
        {
          grid.map((nodes: TPathNode[], i: number) => {
            return (
              <div key={i} className="flex flex-row justify-start w-full">
                {
                  nodes.map((node: TPathNode) => {
                    return (
                      <div className="flex flex-col justify-start relative">
                        <div className="flex flex-row justify-start">
                          <PathNodeElem
                            key={node.ID}
                            Label={node.Label}
                            Link={node.Link}
                            Spacer={node.Spacer}
                          />

                          <div className="flex flex-col justify-center">
                            {ConnectHorizontally(node) &&
                              <div className="border-b-2 border-zinc-900 w-16 h-1"></div>
                            }
                            {!ConnectHorizontally(node) &&
                              <div className="border-b-0 border-zinc-900 w-16 h-1"></div>
                            }
                          </div>
                        </div>
                        {ConnectVertically(node) &&
                          <div className="flex flex-row justify-center -left-8 relative">
                            <div className="border-r-2 border-zinc-900 w-1 h-16"></div>
                          </div>
                        }
                      </div>

                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </div>)
}

export { FundamentalsTree }
