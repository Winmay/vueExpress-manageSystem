<template>
  <el-dialog :title="!addVisible ? '编辑' : '添加'" :visible.sync="editVisible" width="80%" :show-close="false">
    <el-form ref="form" :model="data" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="image">
        <div class="el-upload_tip">请上传尺寸为300*300的jpg/png图片，且大小不能超过2M</div>
        <el-upload
          class="avatar-uploader"
          action="/api/singleUpload"
          name="avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <img v-else-if="data.image" :src="data.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
      imageUrl: '',
      form: {
        name: '',
        image: ''
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
      if (!this.addVisible && this.formData) {
        this.imageUrl = this.formData.image
      }
      return !this.addVisible && this.formData ? this.formData : this.form
    }
  },
  methods: {
    imageForm (file) {
      const isJPG = file.type === 'image/pjpeg' || file.type === 'image/jpeg'
      const isPng = file.type === 'image/png' || file.type === 'image/x-png'
      if (!isJPG && !isPng) {
        this.$message.error('只支持png和jpg格式图片!')
      }
      return isJPG || isPng
    },
    beforeAvatarUpload (file) {
      let isImageForm = this.imageForm(file)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!')
      }
      return isImageForm && isLt2M
    },
    handleAvatarSuccess (response, file, fileList) {
      if (response.code !== 0 || !response.data) {
        this.$message.error('上传失败' + response.msg)
        return
      }
      this.imageUrl = URL.createObjectURL(file.raw)
      if ( !this.addVisible ) {
        this.formData.image = './static/uploads/' + response.data.filename
      } else {
        this.form.image = './static/uploads/' + response.data.filename
      }
    },
    async _cancleDialog () {
      await this.$emit('cancleDialog')
      this.form = {
        name: '',
        image: ''
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
        this.form.image = ''
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
<style scoped>
  .el-upload_tip {
    font-size: 12px;
    line-height: 32px;
    color: #606266;
    margin-bottom: 7px;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
    box-sizing: border-box;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
