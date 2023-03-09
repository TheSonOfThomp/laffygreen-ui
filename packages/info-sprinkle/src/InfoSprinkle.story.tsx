import React from 'react';
import { ComponentStory } from '@storybook/react';

import { css } from '@leafygreen-ui/emotion';
import { StoryMeta } from '@leafygreen-ui/lib';
import { Overline } from '@leafygreen-ui/typography';

import { InfoSprinkle } from '.';

export default StoryMeta({
  title: 'Components/InfoSprinkle',
  component: InfoSprinkle,
  argTypes: {
    rate: {
      control: 'number',
    },
  },
  parameters: {
    default: 'Basic',
    controls: { exclude: ['as', 'darkMode'] },
  },
});

const Template: ComponentStory<typeof InfoSprinkle> = props => (
  <Overline
    className={css`
      display: flex;
      gap: 4px;
      align-items: center;
    `}
  >
    <span>Some text</span>
    <InfoSprinkle {...props} />
  </Overline>
);

export const Basic = Template.bind({});
