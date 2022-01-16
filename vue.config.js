module.exports = {
    lintOnSave: false, // 关闭ESLint的规则检查
    // lintOnSave: 'warning', // 输出提示错误, 但项目继续运行
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                // target: 'http://127.0.0.1',
                // target: 'http://www.codeman.ink:3000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}