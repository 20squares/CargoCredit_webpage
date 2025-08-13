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
    // Buyer (Start point - top)
    { id: 'buyer', label: 'OEM Buyer', tier: 3, x: 500, y: 100 },
    
    // Tier-1 Supplier (below buyer)
    { id: 'tier1', label: 'Tier-1 Supplier', tier: 2, x: 500, y: 250 },
    
    // Tier-2 Suppliers (branching - lower level)
    { id: 'tier2-1', label: 'Component Manufacturer', tier: 1, x: 350, y: 400 },
    { id: 'tier2-2', label: 'Materials Provider', tier: 1, x: 650, y: 400 },
    
    // Tier-3 Supplier (bottom)
    { id: 'tier3', label: 'Raw Materials Supplier', tier: 0, x: 350, y: 550 },
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

export function getScrollBasedFlow(graph: Graph, scrollProgress: number): {
  activeEdges: Array<{ edge: Edge; flowProgress: number }>;
  activeNodes: Array<{ nodeId: string; intensity: number }>;
} {
  // Map scroll progress to flow through the network
  // 0-0.3: Buyer to Tier-1
  // 0.3-0.6: Tier-1 to both Tier-2 suppliers (branching)
  // 0.6-1.0: Tier2-1 to Tier-3
  
  const activeEdges: Array<{ edge: Edge; flowProgress: number }> = [];
  const activeNodes: Array<{ nodeId: string; intensity: number }> = [];
  
  // Always show buyer as starting point
  activeNodes.push({ nodeId: 'buyer', intensity: 1.0 });
  
  // Stage 1: Buyer → Tier-1 (0-0.3)
  if (scrollProgress > 0) {
    const edge1 = graph.edges.find(e => e.from === 'buyer' && e.to === 'tier1');
    if (edge1) {
      const flowProgress = Math.min(1.0, scrollProgress / 0.3);
      activeEdges.push({ edge: edge1, flowProgress });
      
      if (flowProgress > 0.5) {
        activeNodes.push({ nodeId: 'tier1', intensity: Math.min(1.0, (flowProgress - 0.5) * 2) });
      }
    }
  }
  
  // Stage 2: Tier-1 → Tier-2 branches (0.3-0.6)
  if (scrollProgress > 0.3) {
    const normalizedProgress = (scrollProgress - 0.3) / 0.3; // 0-1 for this stage
    
    // Branch to tier2-1
    const edge2a = graph.edges.find(e => e.from === 'tier1' && e.to === 'tier2-1');
    if (edge2a) {
      const flowProgress = Math.min(1.0, normalizedProgress);
      activeEdges.push({ edge: edge2a, flowProgress });
      
      if (flowProgress > 0.5) {
        activeNodes.push({ nodeId: 'tier2-1', intensity: Math.min(1.0, (flowProgress - 0.5) * 2) });
      }
    }
    
    // Branch to tier2-2 (starts slightly later for visual effect)
    const edge2b = graph.edges.find(e => e.from === 'tier1' && e.to === 'tier2-2');
    if (edge2b) {
      const delayedProgress = Math.max(0, normalizedProgress - 0.2); // Start 20% later
      const flowProgress = Math.min(1.0, delayedProgress / 0.8);
      if (flowProgress > 0) {
        activeEdges.push({ edge: edge2b, flowProgress });
        
        if (flowProgress > 0.5) {
          activeNodes.push({ nodeId: 'tier2-2', intensity: Math.min(1.0, (flowProgress - 0.5) * 2) });
        }
      }
    }
  }
  
  // Stage 3: Tier2-1 → Tier-3 (0.6-1.0)
  if (scrollProgress > 0.6) {
    const normalizedProgress = (scrollProgress - 0.6) / 0.4; // 0-1 for this stage
    const edge3 = graph.edges.find(e => e.from === 'tier2-1' && e.to === 'tier3');
    if (edge3) {
      const flowProgress = Math.min(1.0, normalizedProgress);
      activeEdges.push({ edge: edge3, flowProgress });
      
      if (flowProgress > 0.5) {
        activeNodes.push({ nodeId: 'tier3', intensity: Math.min(1.0, (flowProgress - 0.5) * 2) });
      }
    }
  }
  
  return { activeEdges, activeNodes };
}