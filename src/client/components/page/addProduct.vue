<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加产品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-select v-model="form.classify" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品简介">
                        <el-input v-model="form.summary"></el-input>
                    </el-form-item>
                    <el-form-item label="库存">
                        <el-input v-model="form.inventory"></el-input>
                    </el-form-item>
                    <el-form-item label="市场价格">
                        <el-input v-model="form.marketPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣价格">
                        <el-input v-model="form.discountPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态">
                    </el-form-item>
                    <el-form-item label="封面图">
                      <div class="el-upload_tip">请上传尺寸为372*300的jpg/png图片，且大小不能超过2M</div>
                      <el-upload
                        class="avatar-uploader"
                        action="/api/singleUpload"
                        name="avatar"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="轮播图">
                      <el-upload
                        class="upload-demo"
                        action="/api/multiUpload"
                        name="photos"
                        multiple
                        list-type="picture"
                        :file-list="fileList"
                        :before-upload="beforeUpload"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="9"
                        :on-exceed="handleExceed">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">最多只能上传9张照片</div>
                        <div slot="tip" class="el-upload__tip">请上传比例为1:1的正方形图片，且格式为jpg/png文件，大小不能超过5M</div>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="商品说明">
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  data: function () {
    return {
      imageUrl: '',
      fileList: [
        {
          name: '34',
          url: './static/uploads/photos-1527240887426.jpg'
        }
      ],
      form: {
        name: '',
        classify: '',
        summary: '',
        inventory: '',
        marketPrice: '',
        discountPrice: '',
        status: '',
        image: '',
        images: [],
        introduction: ''
      }
    }
  },
  methods: {
    handleAvatarSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    beforeUpload (file) {
      let isImageForm = this.imageForm(file)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isImageForm && isLt5M
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name} ？`)
    },
    async onSubmit () {
      var form = {
        name: this.form.name,
        date: this.form.date,
        address: this.form.address.toString().replace(new RegExp(',', 'gm'), ' ')
      }
      await this.$axios.post('/api/list/add', form)
      await this.$set(this.form, 'name', '')
      await this.$set(this.form, 'date', '')
      await this.$set(this.form, 'address', [])
      await this.$message.success('提交成功！')
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
    width: 186px;
    height: 150px;
    box-sizing: border-box;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 186px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 186px;
    height: 150px;
    display: block;
  }
</style>
