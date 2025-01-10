import '../src/style.css';
import React from 'react';
import type { Preview } from "@storybook/react";
import { NextUIProvider } from '@nextui-org/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: "3em" }}>
        <NextUIProvider>
          <Story />
        </NextUIProvider>
      </div>
    )
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
