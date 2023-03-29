import React, { KeyboardEventHandler, useRef, useState } from 'react';
import { Synth, Transport } from 'tone';

import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { keyMap } from '@leafygreen-ui/lib';
import TextInput from '@leafygreen-ui/text-input';

import { MorseTable, textToMorse } from './MorseCodeTable';
import { MorseInputProps } from './MorseInput.types';

interface KeyLog {
  type: 'up' | 'down';
  time: number;
}

const Beeper = new Synth({
  envelope: {
    attack: 0.0,
    decay: 0,
    sustain: 1,
    release: 0.1,
  },
  oscillator: {
    type: 'square1',
  },
}).toDestination();

/**
 * For use on very low bandwidth machines.
 *
 * Press the space bar to enter morse code characters
 */
export function MorseInput({
  label,
  timeUnit = 70,
  ...props
}: MorseInputProps) {
  const dashTime = 3 * timeUnit;
  const dashThreshold = timeUnit + (dashTime - timeUnit) / 2;
  const charDelay = 3 * timeUnit;
  const spaceDelay = 7 * timeUnit;

  const keyLog = useRef<Array<KeyLog>>([]);
  const characterBuffer = useRef<Array<'-' | '.'>>([]);
  const [charTimerId, setCharTimer] = useState<NodeJS.Timeout>();
  const [spaceTimerId, setSpaceTimer] = useState<NodeJS.Timeout>();
  const [characters, setCharacters] = useState<Array<string>>([]);

  const getValue = () =>
    characters
      .map(char => {
        if (char in MorseTable) {
          return MorseTable[char as keyof typeof MorseTable];
        } else return char;
      })
      .join('');

  const getLastEvent = (type?: KeyLog['type']) => {
    const relevantArray = type
      ? keyLog.current.filter(log => log.type === type)
      : keyLog.current;
    const lastEvent = relevantArray.reverse()[0];
    return lastEvent;
  };

  const getTimeSinceLastEvent = (type?: KeyLog['type']) => {
    const lastEvent = getLastEvent(type);
    return lastEvent ? Date.now() - lastEvent.time : undefined;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    // if it's not the space bar, ignore it
    if (e.keyCode === keyMap.Space) {
      Beeper.triggerAttack('C5');

      // when the key goes down
      // clear the timer(s)
      if (charTimerId) clearTimeout(charTimerId);
      if (spaceTimerId) clearTimeout(spaceTimerId);

      const lastEvent = getLastEvent();

      if (!lastEvent || lastEvent.type === 'up') {
        // Log the keydown event
        keyLog.current.push({
          type: 'down',
          time: Date.now(),
        });
      }
    } else if (e.keyCode === keyMap.Backspace || e.keyCode === keyMap.Delete) {
      const _tmp = [...characters];
      _tmp.pop();
      setCharacters(_tmp);
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = e => {
    // if it's not the space bar, ignore it
    if (e.keyCode === keyMap.Space) {
      const timeSinceLastEvent = getTimeSinceLastEvent('down');

      // When the key comes up
      // save either a dot or dash to the character buffer
      if (timeSinceLastEvent && timeSinceLastEvent > dashThreshold) {
        characterBuffer.current.push('-');
      } else {
        characterBuffer.current.push('.');
      }

      // Wait for another keyDown. If we timeout, then we save the character
      const _charTimer = setTimeout(() => {
        const char = characterBuffer.current.join('');
        let newChars = [...characters];

        if (char in MorseTable) {
          // eslint-disable-next-line no-console
          console.log(char, MorseTable[char as keyof typeof MorseTable]);
          newChars = [...characters, characterBuffer.current.join('')];
          setCharacters([...characters, characterBuffer.current.join('')]);
          characterBuffer.current.length = 0;
        }

        // If we still don't have a keydown after `spaceDelay` ms, then we add a space
        const _spaceTimer = setTimeout(() => {
          setCharacters([...newChars, ' ']);
          characterBuffer.current.length = 0;
        }, spaceDelay);
        setSpaceTimer(_spaceTimer);
      }, charDelay);
      setCharTimer(_charTimer);

      // Log the keyup event
      keyLog.current.push({
        type: 'up',
        time: Date.now(),
      });

      Beeper.triggerRelease();
      Transport.stop();
      Transport.cancel(0);
      Transport.start();
    }
  };

  function playValue() {
    Transport.stop();
    Transport.cancel(0);
    Beeper.toDestination().sync();
    let ellapsedTimeMs = 0; //Transport.now() * 1000 + timeUnit;
    const value = characters.join('');

    value.split('').forEach(char => {
      switch (char) {
        case '.': {
          Beeper.triggerAttackRelease(
            'C5',
            timeUnit / 1000,
            ellapsedTimeMs / 1000,
          );
          ellapsedTimeMs += timeUnit * 2;
          break;
        }

        case '-': {
          Beeper.triggerAttackRelease(
            'C5',
            dashTime / 1000,
            ellapsedTimeMs / 1000,
          );
          ellapsedTimeMs += dashTime * 2;

          break;
        }

        case ' ':
        default: {
          ellapsedTimeMs += spaceDelay;
          break;
        }
      }
    });
    Transport.start();
  }

  return (
    <div
      className={css`
        display: flex;
        align-items: flex-end;
        gap: 4px;
      `}
    >
      <TextInput
        {...props}
        type="text"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        value={getValue()}
        label={label ? textToMorse(label) : ''}
        description="Use the space bar"
      />
      <IconButton
        aria-label="play"
        className={css`
          margin-bottom: 4px;
        `}
        onClick={playValue}
      >
        <Icon glyph="Play" />
      </IconButton>
    </div>
  );
}

MorseInput.displayName = 'MorseInput';
