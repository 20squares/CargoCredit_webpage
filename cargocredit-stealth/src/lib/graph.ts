export type Node = {
  id: string;
  label: string;
  tier: 0 | 1 | 2 | 3;
  x: number;
  y: number;
};

export type Edge = {
  from: string;
  to: string;
  meta?: {
    term?: string;
    amount?: number;
  };
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type Path = {
  nodes: string[];
  edges: Edge[];
};

export function generateGraph(): Graph {
  const nodes: Node[] = [
    // Tier 3 - Buyers
    { id: 'buyer1', label: 'OEM Buyer', tier: 3, x: 800, y: 250 },
    
    // Tier 2 - Tier 1 Suppliers
    { id: 't1-1', label: 'Tier-1 Supplier A', tier: 2, x: 600, y: 150 },
    { id: 't1-2', label: 'Tier-1 Supplier B', tier: 2, x: 600, y: 350 },
    
    // Tier 1 - Tier 2 Suppliers
    { id: 't2-1', label: 'Electronics Supplier', tier: 1, x: 400, y: 100 },
    { id: 't2-2', label: 'Component Manufacturer', tier: 1, x: 400, y: 200 },
    { id: 't2-3', label: 'Materials Provider', tier: 1, x: 400, y: 300 },
    { id: 't2-4', label: 'Assembly Partner', tier: 1, x: 400, y: 400 },
    
    // Tier 0 - Small suppliers
    { id: 'sme1', label: 'SME Supplier 1', tier: 0, x: 200, y: 50 },
    { id: 'sme2', label: 'SME Supplier 2', tier: 0, x: 200, y: 150 },
    { id: 'sme3', label: 'SME Supplier 3', tier: 0, x: 200, y: 250 },
    { id: 'sme4', label: 'SME Supplier 4', tier: 0, x: 200, y: 350 },
    { id: 'sme5', label: 'SME Supplier 5', tier: 0, x: 200, y: 450 },
  ];

  const edges: Edge[] = [
    // SME to Tier-2
    { from: 'sme1', to: 't2-1', meta: { term: 'Net-45', amount: 45000 } },
    { from: 'sme2', to: 't2-1', meta: { term: 'Net-30', amount: 28000 } },
    { from: 'sme2', to: 't2-2', meta: { term: 'Net-60', amount: 62000 } },
    { from: 'sme3', to: 't2-2', meta: { term: 'Net-30', amount: 35000 } },
    { from: 'sme3', to: 't2-3', meta: { term: 'Net-45', amount: 41000 } },
    { from: 'sme4', to: 't2-3', meta: { term: 'Net-30', amount: 33000 } },
    { from: 'sme4', to: 't2-4', meta: { term: 'Net-30', amount: 29000 } },
    { from: 'sme5', to: 't2-4', meta: { term: 'Net-45', amount: 47000 } },
    
    // Tier-2 to Tier-1
    { from: 't2-1', to: 't1-1', meta: { term: 'Net-30', amount: 120000 } },
    { from: 't2-2', to: 't1-1', meta: { term: 'Net-45', amount: 185000 } },
    { from: 't2-3', to: 't1-2', meta: { term: 'Net-30', amount: 150000 } },
    { from: 't2-4', to: 't1-2', meta: { term: 'Net-60', amount: 210000 } },
    
    // Tier-1 to Buyer
    { from: 't1-1', to: 'buyer1', meta: { term: 'Net-30', amount: 850000 } },
    { from: 't1-2', to: 'buyer1', meta: { term: 'Net-45', amount: 920000 } },
  ];

  return { nodes, edges };
}

export function findPaths(graph: Graph): Path[] {
  const paths: Path[] = [];
  const buyer = graph.nodes.find(n => n.tier === 3);
  if (!buyer) return paths;

  // Find all paths from tier 0 nodes to the buyer
  const tier0Nodes = graph.nodes.filter(n => n.tier === 0);
  
  for (const startNode of tier0Nodes) {
    const path = findPathToBuyer(graph, startNode.id, buyer.id);
    if (path) {
      paths.push(path);
    }
  }
  
  return paths;
}

function findPathToBuyer(graph: Graph, startId: string, buyerId: string): Path | null {
  const visited = new Set<string>();
  const pathNodes: string[] = [];
  const pathEdges: Edge[] = [];
  
  function dfs(currentId: string): boolean {
    if (currentId === buyerId) {
      pathNodes.push(currentId);
      return true;
    }
    
    if (visited.has(currentId)) return false;
    visited.add(currentId);
    pathNodes.push(currentId);
    
    const outgoingEdges = graph.edges.filter(e => e.from === currentId);
    for (const edge of outgoingEdges) {
      if (dfs(edge.to)) {
        pathEdges.push(edge);
        return true;
      }
    }
    
    pathNodes.pop();
    return false;
  }
  
  if (dfs(startId)) {
    return { nodes: pathNodes, edges: pathEdges };
  }
  
  return null;
}

export function getRandomPath(paths: Path[]): Path | null {
  if (paths.length === 0) return null;
  return paths[Math.floor(Math.random() * paths.length)];
}