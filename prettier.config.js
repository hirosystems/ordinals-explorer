const TailwindPlugin = require("prettier-plugin-tailwindcss");

module.exports = {
  extends: ["@stacks/prettier-config"],
  plugins: [TailwindPlugin],
};
