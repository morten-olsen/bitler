import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Conversation as ConversationComponent } from './conversation.js';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen.js';

const meta = {
  title: 'Screens/Conversation',
  component: ConversationComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ConversationComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Conversation: Story = {
  args: {
    id: 'test',
  },
  render: (args) => (
    <Fullscreen>
      <ConversationComponent {...args} />
    </Fullscreen>
  ),
};
