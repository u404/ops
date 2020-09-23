"use strict"

const path = require("path")

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")

const WatchMissingNodeModulesPlugin = require("@sc/react-dev-utils/WatchMissingNodeModulesPlugin")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const webpack = require("webpack")

const betterProgress = require("better-webpack-progress")

const common = require("./webpack.common")

process.traceDeprecation = true

const {
  imageLoaderConfig,
  fileLoaderConfig,
  getStyleCongfigs,
  getOptimizationConfig,
} = require("./utils")

module.exports = (app, entry, dev) => {
  const config = common(app, entry, dev)

  config.optimization = getOptimizationConfig(dev)

  config.module.rules = [
    { parser: { requireEnsure: false } },
    {
      test: /\.(js|jsx)$/,
      enforce: "pre",
      use: [
        {
          options: {
            formatter: require.resolve("@sc/react-dev-utils/eslintFormatter"),
            eslintPath: require.resolve("eslint"),
          },
          loader: require.resolve("eslint-loader"),
        },
      ],
      include: app.config.source,
    },
    {

      oneOf: [
        {
          test: /\.(js|jsx)$/,
          include: app.config.source,
          loader: require.resolve("babel-loader"),
          options: {
            customize: require.resolve(
              "babel-preset-react-app/webpack-overrides"
            ),
            plugins: [
              [
                require.resolve("babel-plugin-dva-hmr"),
              ],
              [
                require.resolve("babel-plugin-syntax-dynamic-import"),
              ],
              [
                require.resolve("babel-plugin-import"),
                {
                  libraryName: "@sc/antd",
                  style: false,
                },
              ],
              [
                require.resolve("babel-plugin-named-asset-import"),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent: "@svgr/webpack?-prettier,-svgo![path]",
                    },
                  },
                },
              ],
            ],
            babelrc: false,
            configFile: false,
            presets: [
              [
                require.resolve("babel-preset-react-app"),
              ],
            ],
            cacheDirectory: true,
            cacheCompression: !dev,
            compact: !dev,
          },

        },
        {
          test: /\.(js)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              [
                require.resolve("babel-preset-react-app/dependencies"),
                { helpers: true },
              ],
            ],
            cacheDirectory: true,
            cacheCompression: !dev,
            sourceMaps: false,
          },
        },
        ...getStyleCongfigs(dev),
        imageLoaderConfig,
        fileLoaderConfig,
      ],
    },
  ]

  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
      __DEV__: !dev,
    })
  )

  config.plugins.push(
    new webpack.ProgressPlugin(betterProgress({
      mode: dev ? "bar" : "detailed",
    }))
  )

  if (!dev) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].[hash:8].css",
      })
    )
  } else {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(path.resolve(app.baseDir, "node_modules")),
    )
  }

  return config
}
