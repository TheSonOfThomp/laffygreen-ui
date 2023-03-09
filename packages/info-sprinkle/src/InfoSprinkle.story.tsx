import React from 'react';
import { ComponentStory } from '@storybook/react';

import { InfoSprinkle } from '.';

export default {
  title: 'Components/InfoSprinkle',
  component: InfoSprinkle,
};

const Template: ComponentStory<typeof InfoSprinkle> = props => (
  <InfoSprinkle {...props} />
);

export const Basic = Template.bind({});
