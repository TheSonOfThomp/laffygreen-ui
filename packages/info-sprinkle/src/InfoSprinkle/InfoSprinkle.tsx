import React, { useState } from 'react';
import { random } from 'lodash';

import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';

import { InfoSprinkleProps } from './InfoSprinkle.types';
import { Sprinkle, SprinkleProps } from './Sprinkle';

const sprinkleTimeout = 8_000;

export function InfoSprinkle({ rate = 200, ...props }: InfoSprinkleProps) {
  const [sprinkles, setSprinkles] = useState<Record<string, SprinkleProps>>({});
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  function startSprinkles() {
    // While the (i) is hovered
    // add a sprinkle every interval
    const id = setInterval(() => {
      const sprinkleId = random(0, 999).toFixed(0).padStart(4, '0');
      const newSprinkle = {
        id: sprinkleId,
        angle: random((-Math.PI * 3) / 4, -Math.PI / 4),
      };

      setSprinkles(s => {
        const _s = { ...s };
        _s[sprinkleId] = newSprinkle;
        return _s;
      });

      // After a timeout,
      // remove the sprinkle
      setTimeout(() => {
        setSprinkles(s => {
          const _s = { ...s };
          delete _s[sprinkleId];
          return _s;
        });
      }, sprinkleTimeout);
    }, rate);
    setTimerId(id);
  }

  function stopSprinkles() {
    if (timerId) {
      clearInterval(timerId);
    }
  }

  return (
    <div
      className={css`
        position: relative;
        cursor: pointer;
        display: inline;
        height: 16px;
        width: 16px;
      `}
      {...props}
    >
      <Icon
        glyph="InfoWithCircle"
        fill={palette.gray.base}
        onMouseEnter={startSprinkles}
        onMouseLeave={stopSprinkles}
      />
      <div
        className={css`
          position: absolute;
          inset: 0;
          pointer-events: none;
        `}
      >
        {Object.entries(sprinkles).map(([key, sprinkleProps]) => {
          return <Sprinkle key={key} {...sprinkleProps} />;
        })}
      </div>
    </div>
  );
}

InfoSprinkle.displayName = 'InfoSprinkle';
