import React, { ChangeEvent, useRef } from 'react';

import { css } from '@leafygreen-ui/emotion';
import { useControlledValue, useIdAllocator } from '@leafygreen-ui/hooks';
import { createSyntheticEvent } from '@leafygreen-ui/lib';
import { InlineCode, Label } from '@leafygreen-ui/typography';

import { PhoneNumberInputProps } from './PhoneNumberInput.types';

/**
 * A highly usable, very human number input
 */
export function PhoneNumberInput({
  label,
  value: valueProp,
  onChange,
  ...rest
}: PhoneNumberInputProps) {
  const rangeId = useIdAllocator({});
  const textRef = useRef<HTMLInputElement>(null);

  const { value, handleChange } = useControlledValue(valueProp, onChange);
  const valueAsNumber = Number(value.replace(/-/g, ''));

  function handleRangeChange(e: ChangeEvent<HTMLInputElement>) {
    const _val = e.target.value.padStart(10, '0').split('');

    _val.splice(3, 0, '-');
    _val.splice(7, 0, '-');

    if (textRef.current) {
      textRef.current.value = _val.join('');
      const evt = new Event('change');
      const event = createSyntheticEvent(evt, textRef.current);

      handleChange(event);
    }
  }

  return (
    <div
      className={css`
        width: 512px;
        min-width: 200px;
      `}
    >
      <Label
        className={css`
          display: block;
        `}
        htmlFor={rangeId}
      >
        {label || 'Enter a phone number'}
      </Label>
      {value && <InlineCode>{value}</InlineCode>}
      <input
        className={css`
          width: 100%;
        `}
        id={rangeId}
        type="range"
        min={0}
        max={999_999_9999}
        value={valueAsNumber}
        onChange={handleRangeChange}
        {...rest}
      />
      <input
        className={css`
          position: absolute;
          visibility: hidden;
        `}
        type="text"
        aria-hidden
        ref={textRef}
      />
    </div>
  );
}

PhoneNumberInput.displayName = 'PhoneNumberInput';
