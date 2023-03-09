import { HTMLElementProps } from '@leafygreen-ui/lib';
export interface InfoSprinkleProps extends HTMLElementProps<'div'> {
  /**
   * How fast sprinkles appear
   */
  rate?: number;
}
