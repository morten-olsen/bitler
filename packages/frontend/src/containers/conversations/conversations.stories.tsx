import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Conversations as ConversationsComponent } from './conversations.js';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen.js';

const meta = {
  title: 'Screens/Conversations',
  component: ConversationsComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ConversationsComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Conversations: Story = {
  args: {},
  render: (args) => (
    <Fullscreen>
      <ConversationsComponent {...args} />
    </Fullscreen>
  ),
};
