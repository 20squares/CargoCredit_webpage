import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGraph, findPaths, type Graph, type Path } from '../lib/graph';

interface TooltipData {
  x: number;
  y: number;
  content: string;
}

const GraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph] = useState<Graph>(() => generateGraph());
  const [paths] = useState(() => findPaths(graph));
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const pathIndexRef = useRef(0);

  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Scale factor for responsive design
    const scaleX = width / 1000;
    const scaleY = height / 500;

    // Draw edges
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x * scaleX, fromNode.y * scaleY);
        ctx.lineTo(toNode.x * scaleX, toNode.y * scaleY);
        
        // Highlight if part of current path
        const isActive = currentPath?.edges.some(e => e.from === edge.from && e.to === edge.to);
        
        if (isActive) {
          // Create gradient for active edge
          const gradient = ctx.createLinearGradient(
            fromNode.x * scaleX, fromNode.y * scaleY,
            toNode.x * scaleX, toNode.y * scaleY
          );
          
          const progress = Math.max(0, Math.min(1, animationProgress * paths.length - pathIndexRef.current));
          gradient.addColorStop(0, `rgba(110, 231, 183, ${progress * 0.8})`);
          gradient.addColorStop(progress, `rgba(110, 231, 183, ${progress * 0.8})`);
          gradient.addColorStop(Math.min(1, progress + 0.1), 'rgba(110, 231, 183, 0)');
          gradient.addColorStop(1, 'rgba(110, 231, 183, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
      }
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      const x = node.x * scaleX;
      const y = node.y * scaleY;
      
      // Check if node is in current path
      const isActive = currentPath?.nodes.includes(node.id);
      const nodeIndex = currentPath?.nodes.indexOf(node.id) ?? -1;
      const isCurrentlyAnimated = isActive && 
        animationProgress * currentPath!.nodes.length > nodeIndex &&
        animationProgress * currentPath!.nodes.length < nodeIndex + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, node.tier === 3 ? 10 : 6, 0, Math.PI * 2);
      
      if (isCurrentlyAnimated) {
        // Pulsing effect for currently animated node
        const pulse = Math.sin(animationProgress * Math.PI * 4) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(110, 231, 183, ${pulse})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#6EE7B7';
      } else if (isActive) {
        ctx.fillStyle = 'rgba(110, 231, 183, 0.5)';
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
      
      // Node border
      ctx.strokeStyle = isActive ? '#6EE7B7' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [graph, paths, currentPath, animationProgress]);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawGraph(ctx, rect.width, rect.height);
  }, [drawGraph]);

  useEffect(() => {
    // Animation loop
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Static graph with soft glow on buyer node
      setCurrentPath(paths[0] || null);
      setAnimationProgress(1);
      return;
    }

    const animate = () => {
      setAnimationProgress(prev => {
        if (prev >= 1) {
          // Start new path
          pathIndexRef.current = (pathIndexRef.current + 1) % paths.length;
          setCurrentPath(paths[pathIndexRef.current]);
          return 0;
        }
        return prev + 0.008; // Adjust speed here
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start with first path
    setCurrentPath(paths[0]);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paths]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = rect.width / 1000;
    const scaleY = rect.height / 500;

    // Check if mouse is over any node
    for (const node of graph.nodes) {
      const nodeX = node.x * scaleX;
      const nodeY = node.y * scaleY;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      
      if (distance < 15) {
        // Show tooltip
        let content = node.label;
        if (currentPath?.nodes.includes(node.id)) {
          const edge = currentPath.edges.find(e => e.to === node.id);
          if (edge?.meta) {
            content += `\n${edge.meta.term || ''} ${edge.meta.amount ? `$${edge.meta.amount.toLocaleString()}` : ''}`;
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

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        aria-label="Interactive graph showing supplier-buyer liquidity flow"
        role="img"
      />
      
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute pointer-events-none bg-background/90 border border-white/10 rounded-lg px-3 py-2 text-xs whitespace-pre-line backdrop-blur-sm"
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
        Graph of suppliers and buyers, highlighting a liquidity path.
      </div>
    </div>
  );
};

export default GraphCanvas;