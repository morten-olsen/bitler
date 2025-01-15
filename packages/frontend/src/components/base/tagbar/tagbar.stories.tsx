import type { Meta, StoryFn } from '@storybook/react';
import { Tagbar } from './tagbar.js';
import React, { useState } from 'react';
import { useCapabilities } from '@bitlerjs/react';

const meta = {
  title: 'Components/Base/Autocomplete',
  component: Tagbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta<typeof Tagbar>;

export default meta;

type Story = StoryFn<typeof meta>;

export const Default: Story = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const capabilities = useCapabilities();

  return (
    <Tagbar
      items={capabilities}
      getKey={(item) => item.kind}
      filter={(query, item) => item.name.toLowerCase().includes(query)}
      selected={selected}
      onSelectedChange={setSelected}
    >
      {(item) => (
        <>
          <div>{item.name}</div>
        </>
      )}
    </Tagbar>
  );
};
