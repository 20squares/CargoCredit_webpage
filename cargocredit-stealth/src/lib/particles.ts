export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1
  maxLife: number;
  size: number;
  color: string;
  type: 'po' | 'goods' | 'esg' | 'boe' | 'payment';
  opacity: number;
};

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles = 100;

  update(deltaTime: number) {
    // Update existing particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life += deltaTime / p.maxLife;
      p.opacity = Math.max(0, 1 - p.life);
      return p.life < 1;
    });
  }

  addParticle(particle: Omit<Particle, 'life' | 'opacity'>) {
    if (this.particles.length < this.maxParticles) {
      this.particles.push({
        ...particle,
        life: 0,
        opacity: 1
      });
    }
  }

  // Create particles along a path
  emitAlongPath(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number,
    type: Particle['type'],
    count: number = 3
  ) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const currentX = fromX + dx * progress;
    const currentY = fromY + dy * progress;

    const colors = {
      po: '#8B5CF6', // Purple for PO
      goods: '#3B82F6', // Blue for goods
      esg: '#10B981', // Green for ESG
      boe: '#F59E0B', // Amber for BoE
      payment: '#6EE7B7' // Accent green for payment
    };

    for (let i = 0; i < count; i++) {
      const spread = 8;
      this.addParticle({
        x: currentX + (Math.random() - 0.5) * spread,
        y: currentY + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        maxLife: 800 + Math.random() * 400,
        size: 2 + Math.random() * 2,
        color: colors[type],
        type
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  getParticles() {
    return this.particles;
  }

  clear() {
    this.particles = [];
  }
}

// Bezier curve helper for smooth paths
export function bezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
}

// Get control points for a smooth bezier curve
export function getBezierControlPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  direction: 'down' | 'up'
): { cp1: { x: number; y: number }; cp2: { x: number; y: number } } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Curve factor based on distance
  const curveFactor = Math.min(dist * 0.4, 80);

  if (direction === 'down') {
    return {
      cp1: { x: x1, y: y1 + curveFactor },
      cp2: { x: x2, y: y2 - curveFactor }
    };
  } else {
    return {
      cp1: { x: x1, y: y1 - curveFactor },
      cp2: { x: x2, y: y2 + curveFactor }
    };
  }
}
