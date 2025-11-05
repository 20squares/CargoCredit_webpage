export type ComplianceData = {
  carbonScore: number; // 0-100
  laborCompliance: number; // 0-100
  sustainabilityRating: number; // 0-5 stars
  certifications: string[];
};

export type Node = {
  id: string;
  label: string;
  tier: 0 | 1 | 2 | 3 | 4;
  x: number;
  y: number;
  esg?: ComplianceData; // Named 'esg' for backward compatibility, represents all compliance data
};

export type MilestonePayment = {
  percentage: number;
  label: string;
  condition: string;
};

export type Edge = {
  from: string;
  to: string;
  meta?: {
    term?: string;
    amount?: number;
  };
  milestones?: MilestonePayment[];
  type?: 'purchase-order' | 'goods-flow' | 'esg-flow' | 'boe-flow' | 'payment';
};

export type BoESplit = {
  fromAmount: number;
  splits: Array<{
    amount: number;
    toNode: string;
    label: string;
  }>;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
  boeSplits?: BoESplit[];
};

export type AnimationStage = {
  name: string;
  description: string;
  scrollStart: number;
  scrollEnd: number;
  type: 'po' | 'goods-esg' | 'verification' | 'boe-split' | 'payment';
};

export const ANIMATION_STAGES: AnimationStage[] = [
  {
    name: 'Purchase Order',
    description: 'Purchase orders cascade down the supply chain',
    scrollStart: 0,
    scrollEnd: 0.2,
    type: 'po'
  },
  {
    name: 'Goods & Verification Flow',
    description: 'Physical goods and verification data flow upstream',
    scrollStart: 0.2,
    scrollEnd: 0.4,
    type: 'goods-esg'
  },
  {
    name: 'Smart Contract Verification',
    description: 'Delivery, quality, and compliance conditions verified',
    scrollStart: 0.4,
    scrollEnd: 0.6,
    type: 'verification'
  },
  {
    name: 'Payment Issuance',
    description: 'Payment instruments issued with automated splits and routing',
    scrollStart: 0.6,
    scrollEnd: 0.8,
    type: 'boe-split'
  },
  {
    name: 'Settlement',
    description: 'Automated transfer and final settlement',
    scrollStart: 0.8,
    scrollEnd: 1.0,
    type: 'payment'
  },
];

export function generateGraph(): Graph {
  const nodes: Node[] = [
    // Tier 4: OEM Buyer (Top)
    {
      id: 'buyer',
      label: 'OEM Buyer',
      tier: 4,
      x: 500,
      y: 80,
      esg: { carbonScore: 95, laborCompliance: 98, sustainabilityRating: 5, certifications: ['ISO 14001', 'B Corp'] }
    },

    // Tier 3: Direct Supplier/Assembler
    {
      id: 'tier3-assembler',
      label: 'Assembly Plant',
      tier: 3,
      x: 500,
      y: 200,
      esg: { carbonScore: 88, laborCompliance: 92, sustainabilityRating: 4, certifications: ['ISO 9001', 'SA8000'] }
    },

    // Tier 2: Component Manufacturers (3 branches)
    {
      id: 'tier2-electronics',
      label: 'Electronics Manufacturer',
      tier: 2,
      x: 280,
      y: 340,
      esg: { carbonScore: 82, laborCompliance: 87, sustainabilityRating: 4, certifications: ['ISO 9001', 'RoHS'] }
    },
    {
      id: 'tier2-mechanical',
      label: 'Mechanical Parts',
      tier: 2,
      x: 500,
      y: 340,
      esg: { carbonScore: 79, laborCompliance: 85, sustainabilityRating: 3, certifications: ['ISO 9001'] }
    },
    {
      id: 'tier2-packaging',
      label: 'Packaging Supplier',
      tier: 2,
      x: 720,
      y: 340,
      esg: { carbonScore: 75, laborCompliance: 80, sustainabilityRating: 3, certifications: ['FSC'] }
    },

    // Tier 1: Materials Providers (4 nodes)
    {
      id: 'tier1-pcb',
      label: 'PCB Manufacturer',
      tier: 1,
      x: 220,
      y: 480,
      esg: { carbonScore: 70, laborCompliance: 78, sustainabilityRating: 3, certifications: ['ISO 9001'] }
    },
    {
      id: 'tier1-chips',
      label: 'Chip Supplier',
      tier: 1,
      x: 340,
      y: 480,
      esg: { carbonScore: 85, laborCompliance: 90, sustainabilityRating: 4, certifications: ['ISO 14001'] }
    },
    {
      id: 'tier1-metal',
      label: 'Metal Fabricator',
      tier: 1,
      x: 500,
      y: 480,
      esg: { carbonScore: 65, laborCompliance: 75, sustainabilityRating: 2, certifications: ['ISO 9001'] }
    },
    {
      id: 'tier1-plastics',
      label: 'Plastics Supplier',
      tier: 1,
      x: 720,
      y: 480,
      esg: { carbonScore: 68, laborCompliance: 72, sustainabilityRating: 2, certifications: [] }
    },

    // Tier 0: Raw Materials (3 nodes)
    {
      id: 'tier0-silicon',
      label: 'Silicon Wafer Plant',
      tier: 0,
      x: 280,
      y: 600,
      esg: { carbonScore: 60, laborCompliance: 70, sustainabilityRating: 2, certifications: [] }
    },
    {
      id: 'tier0-minerals',
      label: 'Raw Minerals',
      tier: 0,
      x: 500,
      y: 600,
      esg: { carbonScore: 55, laborCompliance: 65, sustainabilityRating: 2, certifications: ['Conflict-Free'] }
    },
    {
      id: 'tier0-petroleum',
      label: 'Petroleum Products',
      tier: 0,
      x: 720,
      y: 600,
      esg: { carbonScore: 45, laborCompliance: 68, sustainabilityRating: 1, certifications: [] }
    },
  ];

  const edges: Edge[] = [
    // Tier 4 → Tier 3 (Buyer to Assembler)
    {
      from: 'buyer',
      to: 'tier3-assembler',
      meta: { term: 'Net-30', amount: 2000000 },
      milestones: [
        { percentage: 50, label: 'Delivery Confirmed', condition: 'delivery_confirmed' },
        { percentage: 30, label: 'Quality Inspection', condition: 'quality_passed' },
        { percentage: 20, label: 'ESG Verified', condition: 'esg_verified' }
      ]
    },

    // Tier 3 → Tier 2 (Assembler to Component Manufacturers)
    {
      from: 'tier3-assembler',
      to: 'tier2-electronics',
      meta: { term: 'Net-45', amount: 800000 }
    },
    {
      from: 'tier3-assembler',
      to: 'tier2-mechanical',
      meta: { term: 'Net-45', amount: 600000 }
    },
    {
      from: 'tier3-assembler',
      to: 'tier2-packaging',
      meta: { term: 'Net-60', amount: 200000 }
    },

    // Tier 2 → Tier 1 (Components to Materials)
    {
      from: 'tier2-electronics',
      to: 'tier1-pcb',
      meta: { term: 'Net-60', amount: 300000 }
    },
    {
      from: 'tier2-electronics',
      to: 'tier1-chips',
      meta: { term: 'Net-60', amount: 400000 }
    },
    {
      from: 'tier2-mechanical',
      to: 'tier1-metal',
      meta: { term: 'Net-75', amount: 400000 }
    },
    {
      from: 'tier2-packaging',
      to: 'tier1-plastics',
      meta: { term: 'Net-75', amount: 120000 }
    },

    // Tier 1 → Tier 0 (Materials to Raw)
    {
      from: 'tier1-pcb',
      to: 'tier0-silicon',
      meta: { term: 'Net-90', amount: 150000 }
    },
    {
      from: 'tier1-chips',
      to: 'tier0-silicon',
      meta: { term: 'Net-90', amount: 200000 }
    },
    {
      from: 'tier1-metal',
      to: 'tier0-minerals',
      meta: { term: 'Net-90', amount: 250000 }
    },
    {
      from: 'tier1-plastics',
      to: 'tier0-petroleum',
      meta: { term: 'Net-90', amount: 80000 }
    },
  ];

  const boeSplits: BoESplit[] = [
    {
      fromAmount: 2000000,
      splits: [
        { amount: 800000, toNode: 'tier2-electronics', label: 'Electronics Payment' },
        { amount: 600000, toNode: 'tier2-mechanical', label: 'Mechanical Payment' },
        { amount: 200000, toNode: 'tier2-packaging', label: 'Packaging Payment' },
        { amount: 400000, toNode: 'tier3-assembler', label: 'Assembly Margin' }
      ]
    }
  ];

  return { nodes, edges, boeSplits };
}

export function getCurrentStage(scrollProgress: number): AnimationStage | null {
  return ANIMATION_STAGES.find(
    stage => scrollProgress >= stage.scrollStart && scrollProgress < stage.scrollEnd
  ) || ANIMATION_STAGES[ANIMATION_STAGES.length - 1];
}

export function getScrollBasedFlow(graph: Graph, scrollProgress: number): {
  activeEdges: Array<{
    edge: Edge;
    flowProgress: number;
    direction: 'down' | 'up'; // down = PO/BoE, up = goods/ESG
    flowType: 'po' | 'goods' | 'esg' | 'boe' | 'payment';
  }>;
  activeNodes: Array<{
    nodeId: string;
    intensity: number;
    showESG?: boolean;
    showMilestone?: number; // 0-100 percentage
  }>;
  currentStage: AnimationStage | null;
  smartContractConditions?: Array<{
    condition: string;
    met: boolean;
    progress: number;
  }>;
} {
  const activeEdges: Array<{ edge: Edge; flowProgress: number; direction: 'down' | 'up'; flowType: 'po' | 'goods' | 'esg' | 'boe' | 'payment' }> = [];
  const activeNodes: Array<{ nodeId: string; intensity: number; showESG?: boolean; showMilestone?: number }> = [];
  const currentStage = getCurrentStage(scrollProgress);

  // Helper function to update or add nodes without creating duplicates
  const updateOrAddNode = (
    nodeId: string,
    intensity: number,
    showESG?: boolean,
    showMilestone?: number
  ) => {
    const existing = activeNodes.find(n => n.nodeId === nodeId);
    if (existing) {
      existing.intensity = Math.max(existing.intensity, intensity);
      if (showESG !== undefined) existing.showESG = showESG;
      if (showMilestone !== undefined) existing.showMilestone = showMilestone;
    } else {
      activeNodes.push({ nodeId, intensity, showESG, showMilestone });
    }
  };

  // Always show buyer as starting point
  updateOrAddNode('buyer', 1.0);

  // Stage 1: Purchase Order Flow (0-0.2) - DOWN the chain
  if (scrollProgress >= 0 && scrollProgress < 0.2) {
    const stageProgress = scrollProgress / 0.2;

    // Animate PO flowing down through all tiers
    if (stageProgress > 0) {
      const buyerToT3 = graph.edges.find(e => e.from === 'buyer');
      if (buyerToT3) {
        activeEdges.push({ edge: buyerToT3, flowProgress: Math.min(1, stageProgress * 2), direction: 'down', flowType: 'po' });
        if (stageProgress > 0.25) {
          const existing = activeNodes.find(n => n.nodeId === 'tier3-assembler');
          if (existing) {
            existing.intensity = Math.max(existing.intensity, Math.min(1, (stageProgress - 0.25) * 2));
          } else {
            activeNodes.push({ nodeId: 'tier3-assembler', intensity: Math.min(1, (stageProgress - 0.25) * 2) });
          }
        }
      }
    }

    if (stageProgress > 0.3) {
      graph.edges.filter(e => e.from === 'tier3-assembler').forEach((edge, i) => {
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress - 0.3) * 2), direction: 'down', flowType: 'po' });
        if (stageProgress > 0.4 + i * 0.05) {
          const existing = activeNodes.find(n => n.nodeId === edge.to);
          const intensity = Math.min(1, (stageProgress - 0.4 - i * 0.05) * 3);
          if (existing) {
            existing.intensity = Math.max(existing.intensity, intensity);
          } else {
            activeNodes.push({ nodeId: edge.to, intensity });
          }
        }
      });
    }

    if (stageProgress > 0.6) {
      graph.edges.filter(e => e.from.startsWith('tier2-')).forEach(edge => {
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress - 0.6) * 2.5), direction: 'down', flowType: 'po' });
        if (stageProgress > 0.7) {
          const existing = activeNodes.find(n => n.nodeId === edge.to);
          const intensity = Math.min(1, (stageProgress - 0.7) * 3);
          if (existing) {
            existing.intensity = Math.max(existing.intensity, intensity);
          } else {
            activeNodes.push({ nodeId: edge.to, intensity });
          }
        }
      });
    }

    if (stageProgress > 0.8) {
      graph.edges.filter(e => e.from.startsWith('tier1-')).forEach(edge => {
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress - 0.8) * 5), direction: 'down', flowType: 'po' });
        if (stageProgress > 0.85) {
          const existing = activeNodes.find(n => n.nodeId === edge.to);
          const intensity = Math.min(1, (stageProgress - 0.85) * 6);
          if (existing) {
            existing.intensity = Math.max(existing.intensity, intensity);
          } else {
            activeNodes.push({ nodeId: edge.to, intensity });
          }
        }
      });
    }
  }

  // Stage 2: Goods & ESG Flow (0.2-0.4) - UP the chain
  if (scrollProgress >= 0.2 && scrollProgress < 0.4) {
    const stageProgress = (scrollProgress - 0.2) / 0.2;

    // Goods and ESG flow upward from raw materials
    if (stageProgress > 0) {
      graph.edges.filter(e => e.from.startsWith('tier1-')).forEach((edge) => {
        activeEdges.push({ edge, flowProgress: Math.min(1, stageProgress * 2), direction: 'up', flowType: 'goods' });
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress + 0.1) * 2), direction: 'up', flowType: 'esg' });
        const existing = activeNodes.find(n => n.nodeId === edge.from);
        if (existing) {
          existing.intensity = 1;
          existing.showESG = stageProgress > 0.2;
        } else {
          activeNodes.push({ nodeId: edge.from, intensity: 1, showESG: stageProgress > 0.2 });
        }
      });
    }

    if (stageProgress > 0.3) {
      graph.edges.filter(e => e.from.startsWith('tier2-')).forEach(edge => {
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress - 0.3) * 2.5), direction: 'up', flowType: 'goods' });
        activeEdges.push({ edge, flowProgress: Math.min(1, (stageProgress - 0.2) * 2.5), direction: 'up', flowType: 'esg' });
        const existing = activeNodes.find(n => n.nodeId === edge.from);
        if (existing) {
          existing.intensity = 1;
          existing.showESG = true;
        } else {
          activeNodes.push({ nodeId: edge.from, intensity: 1, showESG: true });
        }
      });
    }

    if (stageProgress > 0.6) {
      const t3ToT4 = graph.edges.find(e => e.from === 'tier3-assembler');
      if (t3ToT4) {
        activeEdges.push({ edge: t3ToT4, flowProgress: Math.min(1, (stageProgress - 0.6) * 2.5), direction: 'up', flowType: 'goods' });
        activeEdges.push({ edge: t3ToT4, flowProgress: Math.min(1, (stageProgress - 0.5) * 2.5), direction: 'up', flowType: 'esg' });
        const existing = activeNodes.find(n => n.nodeId === 'tier3-assembler');
        if (existing) {
          existing.intensity = 1;
          existing.showESG = true;
        } else {
          activeNodes.push({ nodeId: 'tier3-assembler', intensity: 1, showESG: true });
        }
      }
    }

    // Show ESG data reaching buyer
    if (stageProgress > 0.8) {
      const existing = activeNodes.find(n => n.nodeId === 'buyer');
      if (existing) {
        existing.intensity = 1;
        existing.showESG = true;
      } else {
        activeNodes.push({ nodeId: 'buyer', intensity: 1, showESG: true });
      }
    }
  }

  // Stage 3: Verification (0.4-0.6) - Smart contract conditions
  if (scrollProgress >= 0.4 && scrollProgress < 0.6) {
    const stageProgress = (scrollProgress - 0.4) / 0.2;

    // Show all nodes with ESG
    graph.nodes.forEach(node => {
      activeNodes.push({ nodeId: node.id, intensity: 1, showESG: true });
    });

    // Show milestone progress
    activeNodes.push({
      nodeId: 'buyer',
      intensity: 1,
      showMilestone: Math.floor(stageProgress * 100)
    });
  }

  // Stage 4: BoE Issuance & Split (0.6-0.8) - DOWN the chain
  if (scrollProgress >= 0.6 && scrollProgress < 0.8) {
    const stageProgress = (scrollProgress - 0.6) / 0.2;

    // Keep all nodes visible with base intensity
    graph.nodes.forEach(node => {
      updateOrAddNode(node.id, 0.5);
    });

    // BoE flows down
    if (stageProgress > 0) {
      const buyerToT3 = graph.edges.find(e => e.from === 'buyer');
      if (buyerToT3) {
        activeEdges.push({ edge: buyerToT3, flowProgress: Math.min(1, stageProgress * 3), direction: 'down', flowType: 'boe' });
        updateOrAddNode('buyer', 1);

        if (stageProgress > 0.3) {
          updateOrAddNode('tier3-assembler', 1);
        }
      }
    }

    // BoE splits and routes to tier 2
    if (stageProgress > 0.5) {
      graph.edges.filter(e => e.from === 'tier3-assembler').forEach((edge, i) => {
        activeEdges.push({
          edge,
          flowProgress: Math.min(1, (stageProgress - 0.5 - i * 0.05) * 3),
          direction: 'down',
          flowType: 'boe'
        });
        if (stageProgress > 0.6 + i * 0.05) {
          updateOrAddNode(edge.to, 1);
        }
      });
    }
  }

  // Stage 5: Payment (0.8-1.0) - Final settlement
  if (scrollProgress >= 0.8) {
    const stageProgress = (scrollProgress - 0.8) / 0.2;

    // Show all nodes during final stage
    graph.nodes.forEach(node => {
      updateOrAddNode(node.id, 0.6);
    });

    // Payment flows back up
    if (stageProgress >= 0) {
      graph.edges.filter(e => e.from === 'tier3-assembler').forEach(edge => {
        activeEdges.push({ edge, flowProgress: Math.min(1, stageProgress * 2), direction: 'up', flowType: 'payment' });
        updateOrAddNode(edge.to, 1);
      });
    }

    if (stageProgress > 0.5) {
      const t3ToT4 = graph.edges.find(e => e.from === 'tier3-assembler');
      if (t3ToT4) {
        activeEdges.push({ edge: t3ToT4, flowProgress: Math.min(1, (stageProgress - 0.5) * 2), direction: 'up', flowType: 'payment' });
        updateOrAddNode('tier3-assembler', 1);
        updateOrAddNode('buyer', 1);
      }
    }

    // Keep network fully visible even after animation completes
    if (stageProgress >= 1) {
      graph.nodes.forEach(node => {
        updateOrAddNode(node.id, 1);
      });
    }
  }

  // Smart contract conditions for verification stage
  let smartContractConditions = undefined;
  if (scrollProgress >= 0.4 && scrollProgress < 0.6) {
    const verificationProgress = (scrollProgress - 0.4) / 0.2;
    smartContractConditions = [
      { condition: 'delivery_confirmed', met: verificationProgress > 0.2, progress: Math.min(1, verificationProgress * 2) * 100 },
      { condition: 'quality_passed', met: verificationProgress > 0.5, progress: Math.min(1, Math.max(0, (verificationProgress - 0.3) * 2)) * 100 },
      { condition: 'esg_verified', met: verificationProgress > 0.8, progress: Math.min(1, Math.max(0, (verificationProgress - 0.6) * 2)) * 100 },
    ];
  }

  return { activeEdges, activeNodes, currentStage, smartContractConditions };
}
