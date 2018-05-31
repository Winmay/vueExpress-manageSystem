<template>
  <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
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
  props: {
    delVisible: {
      type: Boolean
    },
    cancleDialog: {
      type: Function
    },
    deleteRow: {
      type: Function
    }
  }
}
</script>
