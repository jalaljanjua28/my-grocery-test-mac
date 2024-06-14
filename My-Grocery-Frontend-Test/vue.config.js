module.exports = {
  transpileDependencies: ["body-parser"],
  configureWebpack: {
    resolve: {
      alias: {
        "@components": "src/components",
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        // Set the parser options for the Vue loader
        options.parserOptions = {
          parser: "babel-eslint",
        };

        return options;
      });
  },
};
