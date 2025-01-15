
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Dialog as DialogComponent } from "./dialog.js";
import { Fullscreen } from "../../components/layouts/fullscreen/fullscreen.js";

const meta = {
  title: 'Screens/Dialog',
  component: DialogComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof DialogComponent>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Dialog: Story = {
  args: {
  },
  render: (args: any) => (
    <Fullscreen>
      <DialogComponent {...args} />
    </Fullscreen>
  ),
};
