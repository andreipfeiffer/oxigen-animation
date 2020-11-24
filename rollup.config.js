import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: {
    file: "docs/index.js",
    format: "iife",
    globals: {
      animejs: "anime",
    },
    name: "oxygen_animation",
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve({ browser: true }),
    typescript({
      typescript: require("typescript"),
    }),
  ],
};
