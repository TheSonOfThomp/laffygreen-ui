import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sample } from 'lodash';

import Badge, { Variant } from '@leafygreen-ui/badge';
import { css } from '@leafygreen-ui/emotion';

const v_0 = 0.1; // px/ms
const gravity = -0.000_05; // px/ms^2

export interface SprinkleProps {
  angle: number;
  id?: string;
}

export function Sprinkle({ angle }: SprinkleProps) {
  const variant = useMemo(() => sample(Variant), []);
  const vx_0 = useMemo(() => Math.cos(angle) * v_0, [angle]);
  const vy_0 = useMemo(() => Math.sin(angle) * v_0, [angle]);
  const startTime = useRef(0);
  const prevFrame = useRef(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onNextFrame = (t: number) => {
    if (!startTime.current) {
      startTime.current = t;
    }

    const t_total = startTime.current ? t - startTime.current : 0;

    if (t_total > 0) {
      const _x = vx_0 * t_total;
      const _y = (vy_0 - (1 / 2) * gravity * t_total) * t_total;

      setPos(() => ({
        x: _x,
        y: _y,
      }));

      prevFrame.current = t;
    }

    requestAnimationFrame(onNextFrame);
  };

  useEffect(() => {
    requestAnimationFrame(onNextFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Badge
      variant={variant}
      style={{
        /// @ts-expect-error
        '--x': pos.x,
        '--y': pos.y,
      }}
      className={css`
        position: absolute;
        left: -100%;
        transform: translate(calc(var(--x) * 1px), calc(var(--y) * 1px));
        /* rotate(${angle}rad); */
        font-size: 9px;
        line-height: 12px;
        padding-inline: 4px;
        height: auto;
      `}
    >
      info
      {/* vx: {((pos.x - (prevPos?.x ?? 0)) / 8).toFixed(2)} */}
      {/* vy: {((pos.y - (prevPos?.y ?? 0)) / 8).toFixed(2)} */}
    </Badge>
  );
}
