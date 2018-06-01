<template>
  <el-dialog title="提示" :visible.sync="visibleData" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('cancleDialog')">取 消</el-button>
          <el-button type="primary" @click="$emit('deleteRow')">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'Dialog',
  data () {
    return {
      visibleData: false
    }
  },
  watch:{
    delVisible (val) {
      this.visibleData = val;
    },
    visibleData (val) {
      this.$emit("delVisibleChange",val);
    }
  },
  props: {
    delVisible: {
      type: Boolean
    },
    cancleDialog: {
      type: Function
    },
    deleteRow: {
      type: Function
    },
    delVisibleChange: {
      type: Function
    }
  }
}
</script>
