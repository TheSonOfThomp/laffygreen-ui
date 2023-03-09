import React from 'react';

import { css } from '@leafygreen-ui/emotion';

export function Icon() {
  return (
    <span>
      <img
        src="./beyonce.jpg"
        alt="beyoncé"
        height="48"
        width="48"
        className={css`
          border-radius: 4px;
        `}
      />
    </span>
  );
}

Icon.displayName = 'Icon';
