import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "../components/root";

const meta: Meta<typeof ColorPicker> = {
  title: "Color picker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {};
