const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.jsx", // 시작 파일
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
      {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ],
    devServer: {
        static: "./dist",
        historyApiFallback: true // React Router와 함께 사용 시 필요
    },
    mode: "development" // 또는 "production"
};
