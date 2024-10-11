const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // webpack 모듈 추가
module.exports = {
    entry: "./src/index.jsx", // 시작 파일

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/" // 정적 리소스 경로 설정
    },
    
    resolve: {
        extensions: ['.js', '.jsx' , '.ts' , '.tsx', '...'],
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            layouts: path.resolve(__dirname, 'src/layouts/'),
            examples: path.resolve(__dirname, 'src/examples/'),
            assets: path.resolve(__dirname, 'src/assets/'), // assets 경로 추가
            context: path.resolve(__dirname, 'src/context/'), // context 경로 추가
            // 다른 경로 별칭도 여기에 추가할 수 있습니다
        },
        preferRelative: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',

                },
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg|ico)$/i, // jpeg 형식 포함
                type: 'asset/resource',
                exclude: /node_modules/,
                generator: {
                    filename: 'assets/images/[name][ext]',
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            favicon: "./public/favicon.png",
            manifest: './public/manifest.json', // manifest 경로 지정
            templateParameters: {
                PUBLIC_URL: process.env.PUBLIC_URL || '',
            },
        }),
        new webpack.DefinePlugin({
            'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
            'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
        }),
    ],
    
    devServer: {
        hot: true, // HMR 활성화
        static: "./dist",
        historyApiFallback: true,
        port: 3000,
    },
    mode: "development", // 또는 "production"
};
