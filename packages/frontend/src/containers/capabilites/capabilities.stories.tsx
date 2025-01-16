import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Capabilities as CapabilitesComponent } from './capabilites.js';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen.js';

const meta = {
  title: 'Screens/Capabilities',
  component: CapabilitesComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof CapabilitesComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Capabilities: Story = {
  args: {},
  render: (args) => (
    <Fullscreen>
      <CapabilitesComponent {...args} />
    </Fullscreen>
  ),
};
