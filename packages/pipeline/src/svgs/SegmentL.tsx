import * as React from 'react';
import {
  svgInnerOutlineClassName,
  svgOuterOutlineClassName,
  svgInnerClassName,
} from '../styles';

export const SegmentL = ({ className }: { className: string }) => {
  return (
    <svg
      width="66"
      height="56"
      viewBox="0 0 66 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMaxYMid slice"
    >
      <path
        d="M4.10631 5.44611C3.77492 4.78128 4.25844 4 5.00129 4H46.9582C48.8632 4 50.6026 5.08246 51.444 6.79152L60.7982 25.7915C61.4838 27.184 61.4838 28.816 60.7982 30.2085L51.444 49.2085C50.6026 50.9175 48.8632 52 46.9582 52H5.00129C4.25844 52 3.77492 51.2187 4.10631 50.5539L14.2366 30.2305C14.9368 28.8259 14.9368 27.1741 14.2366 25.7695L4.10631 5.44611Z"
        className={svgInnerClassName}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.31892 6.33832C1.32475 4.34383 2.77534 2 5.00386 2H46.9608C49.6277 2 52.063 3.51544 53.2409 5.90813L62.5951 24.9081C63.5549 26.8576 63.5549 29.1424 62.5951 31.0919L53.2409 50.0919C52.063 52.4846 49.6277 54 46.9608 54H5.00386C2.77533 54 1.32476 51.6562 2.31892 49.6617L12.4492 29.3383C12.8693 28.4956 12.8693 27.5044 12.4492 26.6617L2.31892 6.33832ZM5.00386 4C4.26102 4 3.77749 4.78128 4.10888 5.44611L14.2392 25.7695C14.9393 27.1741 14.9393 28.8259 14.2392 30.2305L4.10888 50.5539C3.77749 51.2187 4.26102 52 5.00386 52H46.9608C48.8657 52 50.6052 50.9175 51.4466 49.2085L60.8008 30.2085C61.4863 28.816 61.4863 27.184 60.8008 25.7915L51.4466 6.79152C50.6052 5.08246 48.8657 4 46.9608 4H5.00386Z"
        className={svgInnerOutlineClassName}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M55.0378 50.9753L64.392 31.9753C65.626 29.4688 65.626 26.5312 64.392 24.0247L55.0378 5.02466C53.5233 1.94849 50.3923 0 46.9633 0H5.00642C1.29223 0 -1.12541 3.90649 0.531538 7.23047L10.6618 27.554C10.8019 27.8347 10.8019 28.1653 10.6618 28.446L0.531538 48.7695C-1.1254 52.0935 1.29222 56 5.00642 56H46.9633C50.3923 56 53.5233 54.0515 55.0378 50.9753ZM2.31892 6.33832C1.32475 4.34383 2.77534 2 5.00386 2H46.9608C49.6277 2 52.063 3.51544 53.2409 5.90813L62.5951 24.9081C63.5549 26.8576 63.5549 29.1424 62.5951 31.0919L53.2409 50.0919C52.063 52.4846 49.6277 54 46.9608 54H5.00386C2.77533 54 1.32476 51.6562 2.31892 49.6617L12.4492 29.3383C12.8693 28.4956 12.8693 27.5044 12.4492 26.6617L2.31892 6.33832Z"
        className={svgOuterOutlineClassName}
      />
    </svg>
  );
};