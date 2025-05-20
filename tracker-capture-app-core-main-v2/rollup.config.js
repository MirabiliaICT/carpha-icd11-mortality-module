import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "rollup-plugin-replace";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        strict: false
      }
    ],
    plugins: [
      // resolve({
      //   extensions: [".js", ".jsx", ".json"]
      // }),
      babel({
        // exclude: "node_modules/**"
      }),
      postcss({
        plugins: []
      }),
      commonjs()
      // replace({
      //   "process.env.NODE_ENV": "production"
      // })
    ]
    // external: ["react", "react-dom"]
  }
];
