const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',  // 允許外部 IP 訪問
    port: 8080,       // 根據你實際使用的端口號設置
    https: false,      // 開啟 HTTPS 支持
    allowedHosts: 'all', // 允許所有主機名，解決 Invalid Host header 問題
    client: {
      webSocketURL: 'ws://alex666.xyz/ws',
    },
  }
})