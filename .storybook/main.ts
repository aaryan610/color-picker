import type { StorybookConfig } from "@storybook/react-vite";

import { join, dirname } from "path";

/*
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-designs", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
};
export default config;
