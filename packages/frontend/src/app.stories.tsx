import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { App as AppComponent } from './app.js';

const meta = {
  title: 'App',
  component: AppComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof AppComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const App: Story = {
  render: () => <AppComponent />,
};
