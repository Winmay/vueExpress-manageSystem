<!-- 开发公共组件，可设置填充内容defaultMsg，配置信息config(宽度和高度等)，并提供获取内容的方法。 -->
<template>
  <div>
    <!--下面通过传递进来的id完成初始化-->
    <script :id="randomId" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: 'UE',
  data () {
    return {
      //每个编辑器生成不同的id,以防止冲突
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      //编辑器实例
      instance: null,
      ready: false,
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
  watch: {
    defaultMsg: function(val, oldVal) {
      console.log('defaultMst:' + val)
      if (val != null  && this.ready) {
        // 初始化UE
        this.instance = UE.getEditor(this.randomId, this.config)
        this.instance.setContent(val)
      }
    }
  },
  //此时--el挂载到实例上去了,可以初始化对应的编辑器了
  mounted () {
    console.log('mountedEditor')
    this.initEditor()
  },
  activated () {
    console.log('activatedEditor')
    this.initEditor()
  },
  beforeDestroy() {
    // 组件销毁的时候，要销毁 UEditor 实例
    if(this.instance !== null && this.instance.destroy) {
      this.delay(1.5, () => {
        console.log('beforeDestroyEditor')
        this.instance.destroy()
      })
    }
  },
  deactivated () {
    // 组件销毁的时候，要销毁 UEditor 实例
    if (this.instance !== null && this.instance.destroy) {
      this.delay(1.5, () => {
        console.log('deactivatedEditor')
        this.instance.destroy()
      })
    }
  },
  methods: {
    initEditor() {
      console.log('initEditor')
      const _this = this;
      //dom元素已经挂载上去了
      this.$nextTick(() => {
        this.instance = UE.getEditor(this.randomId, this.config)
        // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
        // 确保UE加载完成后，放入内容。
        this.instance.addListener('ready', () => {
          this.ready = true
          this.$emit('ready', this.instance)
          this.instance.setContent(this.defaultMsg)
        })
      })
      /*const _this = this
      this.instance = UE.getEditor(this.randomId, this.config) // 初始化UE
      this.instance.addListener('ready', function () {
        _this.instance.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      })*/
    },
    setText(con) {
      console.log('setText:' + con)
      this.instance = UE.getEditor(this.randomId, this.config)
      this.instance.setContent(con)
    },
    getUEContent () { // 获取内容方法
      console.log('getUEContent')
      return this.instance.getContent()
    },
    delay (s, next) {
      return new Promise(function (resolve, reject) {
        setTimeout(()=>{
          next()
          resolve()
        }, s * 1000)
      })
    }
  }
}
</script>
