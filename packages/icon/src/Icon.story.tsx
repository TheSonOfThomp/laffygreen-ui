
import React from 'react';
import { ComponentStory } from '@storybook/react';

import {Icon} from '.';

export default {
  title: 'Components/Icon',
  component: Icon,
}

const Template: ComponentStory<typeof Icon> = (props) => (
  <Icon {...props} />
);

export const Basic = Template.bind({});

