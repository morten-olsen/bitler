import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Main } from './main.js';

const meta = {
  title: 'App',
  component: Main,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const App: Story = {
  render: () => <Main />,
};
