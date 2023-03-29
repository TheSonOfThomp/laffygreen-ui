import React, { MouseEvent, useRef, useState } from 'react';

import Card from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { useControlledValue, useEventListener } from '@leafygreen-ui/hooks';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { createSyntheticEvent } from '@leafygreen-ui/lib';
import { Body, H1, H2, Subtitle } from '@leafygreen-ui/typography';

import { baseCardStyles, baseSkeletonStyles } from './DatePicker.styles';
import { DatePickerProps } from './DatePicker.types';
import { SkeletonCard } from './SkeletonCard';
import { useJoke } from './useJoke';

const cardSize = 256;
const dayInMillis = 1000 * 60 * 60 * 24; // ms/s * s/m * m/h * h/d

/**
 * For _quickly_ picking the date!
 */
export function DatePicker({
  value: valueProp = '2023-01-02',
  onChange,
  ...rest
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { value, handleChange, setInternalValue } = useControlledValue(
    valueProp,
    onChange,
  );
  const date = new Date(value);
  const joke = useJoke(value);

  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [dX, setDx] = useState(0);

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    setMouseDownX(e.nativeEvent.pageX);
    setIsDragging(true);
  }

  function handleMouseUp() {
    setIsDragging(false);
    setMouseDownX(0);
    setDx(0);

    if (dX >= cardSize / 3) {
      const curr = date.valueOf();
      const nextDayMs = curr + dayInMillis;
      const nextDay = new Date(nextDayMs);
      const nextVal = nextDay.toUTCString();
      setInternalValue(nextVal);

      if (inputRef.current) {
        handleChange(
          createSyntheticEvent(new Event('change'), inputRef.current),
        );
      }
    }
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (isDragging) {
      setDx(mouseDownX - e.nativeEvent.pageX);
    }
  }

  useEventListener('mouseup', handleMouseUp);

  return (
    <LeafyGreenProvider>
      {/*  eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={css`
          position: relative;
          width: ${cardSize}px;
          height: ${cardSize}px;
          cursor: ${isDragging ? 'grabbing' : 'grab'};

          transform-style: preserve-3d;
          perspective: 1000px;
        `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <SkeletonCard />

        <Card
          className={cx(
            baseCardStyles,
            css`
              transform: rotateY(-${(dX / cardSize) * 180}deg);
              backface-visibility: hidden;
            `,
          )}
        >
          <Subtitle>{date.getFullYear()}</Subtitle>
          <H2>
            {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)}
          </H2>
          <H1>{date.getDate()}</H1>
          <Body
            className={cx(
              css`
                margin: 0.25em 0;
              `,
              {
                [baseSkeletonStyles]: joke === '',
                [css`
                  width: 100%;
                  height: 4em;
                `]: joke === '',
              },
            )}
          >
            {joke}
          </Body>
        </Card>
      </div>

      <input
        ref={inputRef}
        aria-hidden
        className={css`
          position: absolute;
          visibility: hidden;
        `}
        value={value}
        onChange={handleChange}
        type="date"
        {...rest}
      />
    </LeafyGreenProvider>
  );
}

DatePicker.displayName = 'DatePicker';
