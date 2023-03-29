import React, { useEffect, useRef, useState } from 'react';
import { mean, range } from 'lodash';

import Button from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Description } from '@leafygreen-ui/typography';

/** Enables the user to pick the volume from their surroundings */
export function VolumePicker() {
  const playerRef = useRef<HTMLAudioElement>(null);
  const localAnalyzer = useRef<AnalyserNode>();
  const [currentVolume, setCurrentVolume] = useState(40);
  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  function handleDetectClick() {
    if (!localAnalyzer.current) {
      getLocalStream();
    }
    detectVolume();
  }

  function handleSetVolume() {
    setIsDetecting(false);
  }

  const getVolume = () => {
    if (localAnalyzer.current) {
      const volumes = new Uint8Array(localAnalyzer.current.frequencyBinCount);
      localAnalyzer.current.getByteFrequencyData(volumes);
      const vol = mean(volumes);
      setCurrentVolume(vol);
    }
  };

  const detectVolume = () => {
    setIsDetecting(true);
  };

  useEffect(() => {
    if (isDetecting && !intervalId) {
      const id = setInterval(getVolume, 16);
      setIntervalId(id);
    } else if (!isDetecting) {
      intervalId && clearInterval(intervalId);
      setIntervalId(undefined);
    }
  }, [intervalId, isDetecting]);

  function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(connectStream)
      .catch(err => {
        console.error(`you got an error: ${err}`);
      });
  }

  async function connectStream(stream: MediaStream) {
    if (playerRef.current) {
      playerRef.current.srcObject = stream;
    }

    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyzer = context.createAnalyser();

    analyzer.smoothingTimeConstant = 0.8;
    analyzer.fftSize = 1024;

    source.connect(analyzer);
    localAnalyzer.current = analyzer;
    detectVolume();
  }

  return (
    <div
      className={css`
        width: 200px;
      `}
    >
      <div>
        {isDetecting ? (
          <>
            <Button variant="default" onClick={handleSetVolume}>
              Set Volume
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={handleDetectClick}>
            Detect volume
          </Button>
        )}
      </div>
      <div
        className={css`
          display: flex;
          gap: 2px;
          margin: 8px 0;
        `}
      >
        {range(10).map(i => {
          const isActive = currentVolume / 10 >= i;
          return (
            <div
              className={css`
                width: 1em;
                height: 1em;
                border-radius: 4px;
                background-color: ${isActive
                  ? (i > 6 ? palette.yellow : palette.green).base
                  : palette.gray.light2};
              `}
              key={i}
            />
          );
        })}
      </div>
      {isDetecting && (
        <Description
          className={css`
            margin: 8px 0;
          `}
        >
          Speak into the microphone to set volume
        </Description>
      )}
    </div>
  );
}

VolumePicker.displayName = 'VolumePicker';
