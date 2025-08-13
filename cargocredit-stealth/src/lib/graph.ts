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
    // Buyer (Start point - left)
    { id: 'buyer', label: 'OEM Buyer', tier: 3, x: 150, y: 250 },
    
    // Tier-1 Supplier (center)
    { id: 'tier1', label: 'Tier-1 Supplier', tier: 2, x: 400, y: 250 },
    
    // Tier-2 Suppliers (branching - right center)
    { id: 'tier2-1', label: 'Component Manufacturer', tier: 1, x: 650, y: 180 },
    { id: 'tier2-2', label: 'Materials Provider', tier: 1, x: 650, y: 320 },
    
    // Tier-3 Supplier (far right)
    { id: 'tier3', label: 'Raw Materials Supplier', tier: 0, x: 850, y: 180 },
  ];

  const edges: Edge[] = [
    // Buyer to Tier-1
    { from: 'buyer', to: 'tier1', meta: { term: 'Net-30', amount: 1500000 } },
    
    // Tier-1 to Tier-2 (branching)
    { from: 'tier1', to: 'tier2-1', meta: { term: 'Net-45', amount: 650000 } },
    { from: 'tier1', to: 'tier2-2', meta: { term: 'Net-60', amount: 450000 } },
    
    // Tier-2-1 to Tier-3
    { from: 'tier2-1', to: 'tier3', meta: { term: 'Net-90', amount: 150000 } },
  ];

  return { nodes, edges };
}

export function getScrollPath(graph: Graph, scrollProgress: number): Path {
  // Define the complete path sequence
  const sequence = [
    { nodes: ['buyer', 'tier1'], progress: 0.25 },
    { nodes: ['buyer', 'tier1', 'tier2-1'], progress: 0.5 },
    { nodes: ['buyer', 'tier1', 'tier2-2'], progress: 0.65 },
    { nodes: ['buyer', 'tier1', 'tier2-1', 'tier3'], progress: 0.85 },
  ];
  
  // Find which path segment we should show based on scroll
  let activeSequence = sequence[0];
  for (const seq of sequence) {
    if (scrollProgress >= seq.progress) {
      activeSequence = seq;
    }
  }
  
  // Build the path with edges
  const pathEdges: Edge[] = [];
  for (let i = 0; i < activeSequence.nodes.length - 1; i++) {
    const edge = graph.edges.find(
      e => e.from === activeSequence.nodes[i] && e.to === activeSequence.nodes[i + 1]
    );
    if (edge) pathEdges.push(edge);
  }
  
  return {
    nodes: activeSequence.nodes,
    edges: pathEdges,
  };
}