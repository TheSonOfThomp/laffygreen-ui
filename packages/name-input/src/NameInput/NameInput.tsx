import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import TextInput from '@leafygreen-ui/text-input';

import { NameInputProps } from './NameInput.types';
/**
 * A type-safe input for names
 */
export function NameInput({
  gender,
  nameType,
  label,
  ...props
}: NameInputProps) {
  const [name, setName] = useState('');

  const getName = () => {
    const type = nameType || sample(['given', 'family']);

    if (type === 'given') {
      return faker.name.firstName(gender);
    } else {
      return faker.name.lastName(gender);
    }
  };

  return (
    <div
      className={css`
        display: flex;
        align-items: flex-end;
        gap: 4px;
      `}
    >
      <TextInput label={label ?? 'Name'} type="text" value={name} {...props} />
      <IconButton
        aria-label="play"
        className={css`
          margin-bottom: 4px;
        `}
        onClick={() => {
          setName(getName());
        }}
        type="button"
      >
        <Icon glyph="Refresh" />
      </IconButton>
    </div>
  );
}

NameInput.displayName = 'NameInput';
