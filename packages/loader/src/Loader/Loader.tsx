import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { random, sample } from 'lodash';

import { css } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import { palette } from '@leafygreen-ui/palette';

import { LoaderProps } from './Loader.types';

let lastFrameTime = 0;

/** When things take longer than expected. Will it hit the corner?? */
export function Loader({ height = 500, width = 500, ...rest }: LoaderProps) {
  const { darkMode } = useDarkMode();
  const containerRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const maxPos = useMemo(() => {
    return {
      x: (containerRef.current?.getBoundingClientRect().width || width) / 2,
      y: (containerRef.current?.getBoundingClientRect().height || height) / 2,
    };
  }, [height, width]);
  const [angle, setAngle] = useState(
    // Math.PI / 2,
    random(0, Math.PI * 2),
  ); // in radians
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fill, setFill] = useState(palette.green.base as string);

  const setRandomFill = useCallback(() => {
    const excludeLightMode = ['light1', 'light2', 'light3', 'light4'];
    const excludeDarkMode = ['dark1', 'dark2', 'dark3', 'dark4'];
    const { black, white, ...hues } = palette;
    const hueNames = Object.values(hues);
    const colors = hueNames.flatMap(hue =>
      Object.entries(hue)
        .filter(
          ([key]) =>
            !(darkMode ? excludeDarkMode : excludeLightMode).includes(key),
        )
        .map(([_, fill]) => fill),
    );
    const newFill = sample([...colors]) || palette.green.base;
    setFill(newFill);
  }, [darkMode]);

  function frameRequestCallback(t: number) {
    if (t > lastFrameTime) {
      if (pos.x <= -maxPos.x || pos.x >= maxPos.x) {
        // intersecting at left or right
        if (pos.x >= maxPos.x) {
          setPos({
            x: maxPos.x - (wrapperRef.current?.clientWidth || 0) / 2,
            y: pos.y,
          });
        } else {
          setPos({
            x: -maxPos.x + (wrapperRef.current?.clientWidth || 0) / 2,
            y: pos.y,
          });
        }

        setAngle(Math.PI - angle);
        setRandomFill();
      } else if (pos.y <= -maxPos.y || pos.y >= maxPos.y) {
        // intersecting at top or bottom
        if (pos.y >= maxPos.y) {
          setPos({
            x: pos.x,
            y: maxPos.y - 1, //(wrapperRef.current?.clientHeight || 0) / 4,
          });
        } else {
          setPos({
            x: pos.x,
            y: -maxPos.y + 1, //(wrapperRef.current?.clientHeight || 0) / 4,
          });
        }

        setAngle(-angle);
        setRandomFill();
      } else {
        const newPos = {
          x: pos.x + Math.cos(angle),
          y: pos.y + Math.sin(angle),
        };
        setPos(newPos);
      }
      lastFrameTime = t;
    }
  }

  const onNextFrame: FrameRequestCallback = useCallback(frameRequestCallback, [
    angle,
    frameRequestCallback,
    maxPos,
    pos,
    setRandomFill,
  ]);

  useEffect(() => {
    requestAnimationFrame(onNextFrame);
  }, [onNextFrame]);

  return (
    <div
      ref={containerRef}
      className={css`
        width: ${width}px;
        height: ${height}px;
        outline: 1px solid ${palette.gray.dark4};
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${darkMode ? palette.gray.dark4 : palette.white};
      `}
      {...rest}
    >
      <div
        ref={wrapperRef}
        style={{
          // @ts-expect-error
          '--x': pos.x,
          '--y': pos.y,
        }}
        className={css`
          transform: translate(calc(var(--x) * 1px), calc(var(--y) * 1px));
        `}
      >
        <MongoDBLogoMark
          height={100}
          className={css`
            & > path {
              fill: ${fill};
            }
          `}
        />
      </div>
    </div>
  );
}

Loader.displayName = 'Loader';
