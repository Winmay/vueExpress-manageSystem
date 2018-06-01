<template>
  <el-dialog :title="!addVisible ? '编辑' : '添加'" :visible.sync="editVisible" width="80%" :show-close="false">
    <el-form ref="form" :model="data" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="_cancleDialog">取 消</el-button>
      <el-button type="primary" @click="() => !addVisible ? _saveEdit() : addCategory()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import axios from '../../router/ajaxModel'
export default {
  name: 'addCategoryDialog',
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  props: {
    addVisible: {
      type: Boolean,
      default: true
    },
    editVisible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    cancleDialog: {
      type: Function
    },
    saveEdit: {
      type: Function
    },
    getCategoryData: {
      type: Function
    }
  },
  computed: {
    data () {
      return !this.addVisible && this.formData ? this.formData : this.form
    }
  },
  methods: {
    async _cancleDialog () {
      await this.$emit('cancleDialog')
      this.form = {
        name: ''
      }
    },
    //添加分类
    async addCategory () {
      console.log('addCategory')
      var data = await axios.ajaxPost('/api/category/add', this.form)
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        this.form.name = ''
        await this.$message.success('提交成功！')
        await this._cancleDialog()
        await this.$emit('getCategoryData')
      }
    },
    // 保存编辑
    async _saveEdit () {
      console.log('editCategory')
      console.log(this.formData)
      await this.$emit('saveEdit', this.formData)
    }
  }
}
</script>
