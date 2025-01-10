import type { Meta, StoryFn } from '@storybook/react';
import { Tagbar } from './tagbar';
import { useState } from 'react';

const meta = {
  title: 'Base/Autocomplete',
  component: Tagbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta<typeof Tagbar>;

export default meta;

type Story = StoryFn<typeof meta>;

const people = [
  { id: 1, name: 'Tom Cook' },
  { id: 2, name: 'Wade Cooper' },
  { id: 3, name: 'Tanya Fox' },
  { id: 4, name: 'Arlene Mccoy' },
  { id: 5, name: 'Devon Webb' },
]

export const Default: Story = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Tagbar
      items={people}
      getKey={item => item.id.toString()}
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
  )
};
