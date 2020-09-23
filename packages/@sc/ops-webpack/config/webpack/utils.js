"use strict"

const autoprefixer = require("autoprefixer")

const getCSSModuleLocalIdent = require("@sc/react-dev-utils/getCSSModuleLocalIdent")

const TerserPlugin = require("terser-webpack-plugin")

const safePostCssParser = require("postcss-safe-parser")

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const normalizeUrl = require("normalizeurl")

exports.concatUrl = function (...pathes) {
  const result = pathes.reduce((pre, next) => {
    if (!pre) return next
    let slash = 0
    next[0] === "/" && (slash += 1)
    pre.charAt(pre.length - 1) === "/" && (slash += 1)
    if (slash === 2) {
      return pre + next.substr(1)
    } else if (slash === 1) {
      return pre + next
    }
    return `${pre}/${next}`
  })

  return normalizeUrl(result)
}

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const imageLoaderConfig = {
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
  loader: require.resolve("url-loader"),
  options: {
    limit: 10000,
    name: "assets/[name]-[hash:5].[ext]",
  },
}

const fileLoaderConfig = {
  test: [
    /\.ico$/,
    /\.svgz?$/,
    /\.woff2?$/,
    /\.otf$/,
    /\.tiff?$/,
    /\.ttf$/,
    /\.eot$/,
    /\.midi?$/,
  ],
  loader: require.resolve("file-loader"),
  options: {
    name: "assets/[name]-[hash:5].[ext]",
  },
}

const shouldUseSourceMap = false

const getStyleLoaders = (dev, cssOptions, preProcessor) => {
  const loaders = dev ?
    [
      require.resolve("style-loader"),
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            autoprefixer({
              overrideBrowserslist: [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"],
              flexbox: "no-2009",
            }),
          ],
        },
      },
    ] : [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            autoprefixer({
              overrideBrowserslist: [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"],
              flexbox: "no-2009",
            }),
          ],
          sourceMap: shouldUseSourceMap,
        },
      },
    ]
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor))
  }
  return loaders
}

function getStyleCongfigs(dev) {
  return dev ? [
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getStyleLoaders(dev, {
        importLoaders: 1,
      }),
    },
    {
      test: cssModuleRegex,
      use: getStyleLoaders(dev, {
        importLoaders: 1,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      }),
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(dev, { importLoaders: 2 }, "sass-loader"),
    },
    {
      test: sassModuleRegex,
      use: getStyleLoaders(dev,
        {
          importLoaders: 2,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        "sass-loader"),
    },
  ] : [
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      loader: getStyleLoaders(dev, {
        importLoaders: 1,
        sourceMap: shouldUseSourceMap,
      }),
      sideEffects: true,
    },
    {
      test: cssModuleRegex,
      loader: getStyleLoaders(dev, {
        importLoaders: 1,
        sourceMap: shouldUseSourceMap,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      }),
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      loader: getStyleLoaders(dev,
        {
          importLoaders: 2,
          sourceMap: shouldUseSourceMap,
        },
        "sass-loader"),
      sideEffects: true,
    },
    {
      test: sassModuleRegex,
      loader: getStyleLoaders(dev,
        {
          importLoaders: 2,
          sourceMap: shouldUseSourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        "sass-loader"),
    },
  ]
}

function getOptimizationConfig(dev) {
  return dev ? {

    // splitChunks: {
    //   chunks: 'all',
    //   name: false,
    // },

    // runtimeChunk: {
    //   name: "manifest",
    // },
  } : {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
              inline: false,
              annotation: true,
            }
            : false,
        },
      }),
    ],
    // splitChunks: {
    //   chunks: 'all',
    //   name: false,
    // },
    // runtimeChunk: {
    //   name: "manifest",
    // },
  }
}

exports.getOptimizationConfig = getOptimizationConfig
exports.imageLoaderConfig = imageLoaderConfig
exports.fileLoaderConfig = fileLoaderConfig
exports.getStyleCongfigs = getStyleCongfigs
