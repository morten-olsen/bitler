import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Capability as CapabilityComponent } from './capability.js';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen.js';

const meta = {
  title: 'Screens/Capability',
  component: CapabilityComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof CapabilityComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Capability: Story = {
  args: {
    kind: 'history.list',
  },
  render: (args) => (
    <Fullscreen>
      <CapabilityComponent {...args} />
    </Fullscreen>
  ),
};
