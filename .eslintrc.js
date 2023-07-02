module.exports = {
    root: true, // 只将当前项目应用此规则
    parserOptions: {
      "parser": "babel-eslint",
      "sourceType": 'module', // 设置为  "module" ，"script" (默认)
      // "ecmaVersion": 6 // 启用es6语法，不自动启用es6全局变量
    },
    parser: "vue-eslint-parser", // 识别.vue文件 需下载eslint-plugin-vue
    // 想启用的环境
    env: {
      "browser": true,
      "node": true,
      "es6": true
    },
     //继承插件的规则
    extends: [
    //   "eslint:recommended", // 启动被标记为 “√” 默认规则
    //   "plugin:prettier/recommended" // 别人写好的规则，依赖包eslint-config-***，这里用的是prettier规则
    ],
    // 配置插件名字的列表。插件名称可以省略 ‘eslint-plugin- '前缀。
    plugins: [ 
      'vue', // eslint-plugin-vue
    //   'prettier' // eslint-plugin-prettier
    ],
    // 自定义规则 优先级最高
    "rules": {
      "no-console": 0
    }
  }