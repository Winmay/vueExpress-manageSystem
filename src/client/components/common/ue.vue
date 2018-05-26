<!-- 开发公共组件，可设置填充内容defaultMsg，配置信息config(宽度和高度等)，并提供获取内容的方法。 -->
<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: 'UE',
  data () {
    return {
      editor: null
    }
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    }
  },
  mounted () {
    const _this = this
    this.editor = UE.getEditor('editor', this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>
