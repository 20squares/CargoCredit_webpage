import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGraph, getScrollBasedFlow, type Graph, ANIMATION_STAGES } from '../lib/graph';
import { ParticleSystem, getBezierControlPoints, bezierPoint } from '../lib/particles';

interface TooltipData {
  x: number;
  y: number;
  content: string;
}

const GraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph] = useState<Graph>(() => generateGraph());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem());
  const lastTimeRef = useRef<number>(Date.now());

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Scale factors for responsive design
    const scaleX = width / 1000;
    const scaleY = height / 700;

    // Get current flow state
    const flowState = getScrollBasedFlow(graph, scrollProgress);

    // Draw all edges first (inactive)
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);

      if (fromNode && toNode) {
        const x1 = fromNode.x * scaleX;
        const y1 = fromNode.y * scaleY;
        const x2 = toNode.x * scaleX;
        const y2 = toNode.y * scaleY;

        // Use bezier curves for organic look
        const { cp1, cp2 } = getBezierControlPoints(x1, y1, x2, y2, 'down');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, x2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw active flow edges with enhanced effects
    flowState.activeEdges.forEach(({ edge, flowProgress, direction, flowType }) => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);

      if (fromNode && toNode) {
        const x1 = fromNode.x * scaleX;
        const y1 = fromNode.y * scaleY;
        const x2 = toNode.x * scaleX;
        const y2 = toNode.y * scaleY;

        const { cp1, cp2 } = getBezierControlPoints(x1, y1, x2, y2, direction);

        // Color based on flow type
        const colors = {
          po: { main: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.6)' },
          goods: { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },
          esg: { main: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' },
          boe: { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)' },
          payment: { main: '#6EE7B7', glow: 'rgba(110, 231, 183, 0.6)' }
        };

        const color = colors[flowType];

        // Draw glowing trail
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = color.glow;

        // Create gradient along the curve
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const flowEnd = Math.min(1, flowProgress);
        const glowSize = 0.08;

        gradient.addColorStop(0, `${color.main}40`);

        if (flowEnd > glowSize) {
          gradient.addColorStop(Math.max(0, flowEnd - glowSize), `${color.main}40`);
          gradient.addColorStop(flowEnd - glowSize/2, color.main);
        }

        gradient.addColorStop(flowEnd, color.main);

        if (flowEnd < 1) {
          gradient.addColorStop(Math.min(1, flowEnd + 0.01), 'rgba(255,255,255,0)');
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, x2, y2);
        ctx.stroke();

        ctx.restore();

        // Emit particles along the path
        if (flowProgress > 0 && flowProgress < 1) {
          // Emit particles based on frame time
          const now = Date.now();
          const deltaTime = now - lastTimeRef.current;

          if (deltaTime > 50) { // Throttle particle emission
            particleSystemRef.current.emitAlongPath(
              x1, y1, x2, y2, flowProgress, flowType, 2
            );
          }
        }

        // Draw amount label on active edges
        if (edge.meta?.amount && flowProgress > 0.3) {
          const midPoint = bezierPoint(0.5, { x: x1, y: y1 }, cp1, cp2, { x: x2, y: y2 });

          ctx.save();
          ctx.font = '11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Background for label
          const text = formatAmount(edge.meta.amount);
          const metrics = ctx.measureText(text);
          const padding = 6;

          ctx.fillStyle = 'rgba(11, 11, 12, 0.9)';
          ctx.fillRect(
            midPoint.x - metrics.width / 2 - padding,
            midPoint.y - 8,
            metrics.width + padding * 2,
            16
          );

          ctx.fillStyle = color.main;
          ctx.fillText(text, midPoint.x, midPoint.y);
          ctx.restore();
        }
      }
    });

    // Update and draw particles
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    particleSystemRef.current.update(deltaTime);
    particleSystemRef.current.draw(ctx);

    // Draw nodes
    graph.nodes.forEach(node => {
      const x = node.x * scaleX;
      const y = node.y * scaleY;

      // Check if node is active
      const activeNode = flowState.activeNodes.find(n => n.nodeId === node.id);
      const isActive = !!activeNode;
      const intensity = activeNode?.intensity || 0;
      const showESG = activeNode?.showESG || false;

      // Node size based on tier
      const baseSize = node.id === 'buyer' ? 12 : node.tier >= 3 ? 10 : node.tier >= 2 ? 9 : 8;
      const size = baseSize + (isActive ? intensity * 2 : 0);

      ctx.save();

      // Glow effect for active nodes
      if (isActive && intensity > 0.5) {
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = showESG ? '#10B981' : '#6EE7B7';
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);

      if (isActive) {
        const alpha = 0.4 + (intensity * 0.6);
        ctx.fillStyle = showESG ? `rgba(16, 185, 129, ${alpha})` : `rgba(110, 231, 183, ${alpha})`;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      }
      ctx.fill();

      // Node border
      ctx.strokeStyle = isActive ? (showESG ? '#10B981' : '#6EE7B7') : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw node labels for active nodes
      if (isActive && intensity > 0.6) {
        ctx.save();
        ctx.fillStyle = `rgba(245, 247, 250, ${intensity})`;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // Background for text
        const labelY = y - size - 5;
        const metrics = ctx.measureText(node.label);
        const padding = 4;

        ctx.fillStyle = 'rgba(11, 11, 12, 0.85)';
        ctx.fillRect(
          x - metrics.width / 2 - padding,
          labelY - 12,
          metrics.width + padding * 2,
          16
        );

        ctx.fillStyle = `rgba(245, 247, 250, ${intensity})`;
        ctx.fillText(node.label, x, labelY);
        ctx.restore();
      }

      // Draw ESG badge
      if (showESG && node.esg && isActive) {
        const badgeSize = 6;
        const badgeX = x + size - 2;
        const badgeY = y - size + 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeSize, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.strokeStyle = '#0B0B0C';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    });

  }, [graph, scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawGraph(ctx, rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawGraph]);

  useEffect(() => {
    // Scroll-based animation
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = Math.min(1, Math.max(0, scrollY / scrollableHeight));

      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          drawGraph(ctx, rect.width, rect.height);
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [drawGraph]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = rect.width / 1000;
    const scaleY = rect.height / 700;

    // Check if mouse is over any node
    const flowState = getScrollBasedFlow(graph, scrollProgress);

    for (const node of graph.nodes) {
      const nodeX = node.x * scaleX;
      const nodeY = node.y * scaleY;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);

      const size = node.id === 'buyer' ? 12 : node.tier >= 3 ? 10 : node.tier >= 2 ? 9 : 8;

      if (distance < size + 5) {
        let content = `${node.label}`;

        const activeNode = flowState.activeNodes.find(n => n.nodeId === node.id);

        if (activeNode?.showESG && node.esg) {
          content += `\n\nCompliance Data:`;
          content += `\n🌱 Carbon: ${node.esg.carbonScore}/100`;
          content += `\n👷 Labor: ${node.esg.laborCompliance}/100`;
          content += `\n⭐ Sustainability: ${node.esg.sustainabilityRating}/5`;
          if (node.esg.certifications.length > 0) {
            content += `\n📜 ${node.esg.certifications.join(', ')}`;
          }
        }

        // Find incoming edge
        const incomingEdge = graph.edges.find(e => e.to === node.id);
        if (incomingEdge?.meta) {
          if (incomingEdge.meta.amount) {
            content += `\n\n💰 ${formatAmount(incomingEdge.meta.amount)}`;
          }
          if (incomingEdge.meta.term) {
            content += `\n📅 ${incomingEdge.meta.term}`;
          }
        }

        setTooltip({
          x: e.clientX,
          y: e.clientY - 10,
          content
        });
        return;
      }
    }

    setTooltip(null);
  };

  const currentStage = ANIMATION_STAGES.find(
    stage => scrollProgress >= stage.scrollStart && scrollProgress < stage.scrollEnd
  ) || ANIMATION_STAGES[ANIMATION_STAGES.length - 1];

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        aria-label="Interactive deep-tier supply chain finance visualization"
        role="img"
      />

      {/* Stage indicator */}
      <AnimatePresence mode="wait">
        {currentStage && scrollProgress > 0.05 && (
          <motion.div
            key={currentStage.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-background/90 backdrop-blur-md border border-white/10 rounded-lg px-6 py-3">
              <div className="text-xs text-accent/80 font-medium mb-1">
                Stage {ANIMATION_STAGES.indexOf(currentStage) + 1} of {ANIMATION_STAGES.length}
              </div>
              <div className="text-sm font-semibold text-text">{currentStage.name}</div>
              <div className="text-xs text-text/60 mt-1">{currentStage.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute pointer-events-none bg-background/95 border border-white/10 rounded-lg px-4 py-3 text-xs whitespace-pre-line backdrop-blur-sm max-w-xs"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sr-only">
        Deep-tier supply chain finance visualization showing purchase orders, goods flow, ESG data collection, smart contract verification, Bill of Exchange issuance with automated splits, and final payment settlement.
      </div>
    </div>
  );
};

export default GraphCanvas;
