import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import ConfirmationModal from '@leafygreen-ui/confirmation-modal';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { StoryMeta } from '@leafygreen-ui/lib';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';

import { CancelButton } from '.';

export default StoryMeta({
  title: 'Components/CancelButton',
  component: CancelButton,
  parameters: {
    default: 'Basic',
    controls: {
      exclude: ['container'],
    },
  },
  args: {
    darkMode: false,
  },
});

const Template: ComponentStory<typeof CancelButton> = ({
  // eslint-disable-next-line react/prop-types
  darkMode,
  ...props
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <Body darkMode={darkMode}>
        Click the button to cancel your subscription
      </Body>
      <CancelButton
        darkMode={darkMode}
        {...props}
        onClick={() => setModalOpen(true)}
        container={
          document.querySelector('#story--components-cancelbutton--basic') ||
          document.querySelector('#root')
        }
      />
      <ConfirmationModal
        open={modalOpen}
        title="Ok to cancel?"
        buttonText="Ok"
        onCancel={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        closeIconColor={palette.red.base}
      >
        {' '}
      </ConfirmationModal>
    </LeafyGreenProvider>
  );
};

export const Basic = Template.bind({});
