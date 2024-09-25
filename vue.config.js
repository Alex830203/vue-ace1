const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',  // 允許外部 IP 訪問
    port: 8080,       // 根據你實際使用的端口號設置
    allowedHosts: 'all', // 允許所有主機名，解決 Invalid Host header 問題
  }
})
