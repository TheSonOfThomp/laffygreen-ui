import { css, keyframes } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';

const grow = keyframes`
  to {
    scale: 6;
  } 
`;

const wobble = keyframes`
  0% {
    translate: 0% -3%;
  } 
  100% {
    translate: 0% 3%;
  }
`;

export const innerStyles = css`
  display: flex;
  justify-content: center;
  position: relative;
`;

export const toastStyles = css`
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  scale: 0.3;
  transform-origin: top;
  translate: 0% 0%;
  animation-name: ${grow}, ${wobble};
  animation-duration: 30000ms, 2s;
  animation-timing-function: cubic-bezier(0, 0, 1, 0), ease-in-out;
  animation-delay: 1s, 1s;
  animation-iteration-count: infinite;
  animation-direction: normal, alternate;
  animation-fill-mode: none, both;
`;

export const bodyStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: ${palette.black};
  font-size: 60px;
  padding: 0 20px;
`;
