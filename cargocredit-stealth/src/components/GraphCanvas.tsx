import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGraph, getScrollPath, type Graph, type Path } from '../lib/graph';

interface TooltipData {
  x: number;
  y: number;
  content: string;
}

const GraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph] = useState<Graph>(() => generateGraph());
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawGraph = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Scale factor for responsive design (adjusted for vertical layout)
    const scaleX = width / 1000;
    const scaleY = height / 650;

    // Draw all edges first (inactive)
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x * scaleX, fromNode.y * scaleY);
        ctx.lineTo(toNode.x * scaleX, toNode.y * scaleY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw active path edges on top
    if (currentPath) {
      currentPath.edges.forEach((edge) => {
        const fromNode = graph.nodes.find(n => n.id === edge.from);
        const toNode = graph.nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          // Animated gradient flowing along the edge
          const gradient = ctx.createLinearGradient(
            fromNode.x * scaleX, fromNode.y * scaleY,
            toNode.x * scaleX, toNode.y * scaleY
          );
          
          // Continuous flowing animation based on time
          const time = Date.now() * 0.001; // Convert to seconds
          const flowProgress = (time * 0.5) % 2; // Continuous flow every 2 seconds
          
          // Create a flowing gradient effect
          const glowPos1 = (flowProgress % 1);
          const glowPos2 = ((flowProgress + 0.3) % 1);
          
          gradient.addColorStop(0, 'rgba(110, 231, 183, 0.2)');
          gradient.addColorStop(Math.max(0, glowPos1 - 0.1), 'rgba(110, 231, 183, 0.2)');
          gradient.addColorStop(glowPos1, 'rgba(110, 231, 183, 0.8)');
          gradient.addColorStop(Math.min(1, glowPos1 + 0.1), 'rgba(110, 231, 183, 0.2)');
          gradient.addColorStop(Math.max(0, glowPos2 - 0.1), 'rgba(110, 231, 183, 0.2)');
          gradient.addColorStop(glowPos2, 'rgba(110, 231, 183, 0.6)');
          gradient.addColorStop(Math.min(1, glowPos2 + 0.1), 'rgba(110, 231, 183, 0.2)');
          gradient.addColorStop(1, 'rgba(110, 231, 183, 0.2)');
          
          ctx.beginPath();
          ctx.moveTo(fromNode.x * scaleX, fromNode.y * scaleY);
          ctx.lineTo(toNode.x * scaleX, toNode.y * scaleY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
    }

    // Draw nodes
    graph.nodes.forEach(node => {
      const x = node.x * scaleX;
      const y = node.y * scaleY;
      
      // Check if node is in current path
      const isActive = currentPath?.nodes.includes(node.id);
      const nodeIndex = currentPath?.nodes.indexOf(node.id) ?? -1;
      const isLastNode = isActive && nodeIndex === currentPath!.nodes.length - 1;
      
      ctx.beginPath();
      ctx.arc(x, y, node.id === 'buyer' ? 10 : 8, 0, Math.PI * 2);
      
      if (isActive) {
        if (isLastNode) {
          // Enhanced pulsing effect for last active node
          const time = Date.now() * 0.001;
          const pulse = Math.sin(time * 2) * 0.4 + 0.6;
          ctx.fillStyle = `rgba(110, 231, 183, ${pulse})`;
          ctx.fill();
          
          // Dynamic glow effect
          const glowIntensity = Math.sin(time * 1.5) * 10 + 20;
          ctx.shadowBlur = glowIntensity;
          ctx.shadowColor = '#6EE7B7';
        } else {
          // Subtle glow for active nodes
          const time = Date.now() * 0.001;
          const brightness = Math.sin(time * 1.5 + nodeIndex) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(110, 231, 183, ${brightness})`;
          ctx.fill();
          
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#6EE7B7';
        }
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
      
      // Node border
      ctx.strokeStyle = isActive ? '#6EE7B7' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add labels for active nodes
      if (isActive) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y - 15);
      }
    });
  }, [graph, currentPath, scrollProgress]);

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
    // Scroll-based animation
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = Math.min(1, Math.max(0, scrollY / scrollableHeight));
      
      setScrollProgress(progress);
      
      // Update path based on scroll
      const newPath = getScrollPath(graph, progress);
      setCurrentPath(newPath);
    };

    // Initial setup
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [graph]);

  // Animation loop for pulsing effects and gradient movement
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
    <div ref={containerRef} className="relative w-full h-full">
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