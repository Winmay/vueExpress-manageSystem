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
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="categoryId">
                        <el-select v-model="form.categoryId" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品简介" prop="summary">
                        <el-input v-model="form.summary"></el-input>
                    </el-form-item>
                    <el-form-item label="库存" prop="inventory">
                        <el-input v-model="form.inventory"></el-input>
                    </el-form-item>
                    <el-form-item label="市场价格" prop="marketPrice">
                        <el-input v-model="form.marketPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣价格" prop="discountPrice">
                        <el-input v-model="form.discountPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态">
                    </el-form-item>
                    <el-form-item label="封面图" prop="image">
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
                    <el-form-item label="轮播图" prop="images">
                      <el-upload
                        ref="uploadMulti"
                        class="upload-demo"
                        action="/api/multiUpload"
                        name="photos"
                        multiple
                        list-type="picture"
                        :file-list="form.images"
                        :before-upload="beforeUpload"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="9"
                        :on-exceed="handleExceed"
                        :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">最多只能上传9张照片</div>
                        <div slot="tip" class="el-upload__tip">请上传比例为1:1的正方形图片，且格式为jpg/png文件，大小不能超过5M</div>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="商品说明">
                    </el-form-item>
                    <div class="editor-container">
                      <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
import UE from '../common/ue.vue'
export default {
  components: {UE},
  data: function () {
    return {
      defaultMsg: '这里是UE测试',
      config: {
        toolbars: [
          ['fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'subscript', 'superscript', 'removeformat', 'formatmatch', 'autotypeset', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'directionalityltr', 'directionalityrtl', 'indent', '|', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|', 'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', 'edittip ', '|', 'insertimage', 'emotion', '|', 'background', 'template', '|', 'horizontal', 'date', 'time', 'spechars', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'edittable', 'edittd', '|', 'preview', 'searchreplace', 'help']
        ],
        initialFrameWidth: null,
        initialFrameHeight: 500,
        autoFloatEnabled: false
      },
      imageUrl: '',
      images: [
        {
          name: '34',
          url: './static/uploads/photos-1527240887426.jpg'
        }
      ],
      form: {
        name: '',
        categoryId: '',
        summary: '',
        inventory: 0,
        marketPrice: 0,
        discountPrice: 0,
        status: '',
        image: '',
        images: [
          {
            name: '34',
            url: './static/uploads/photos-1527240887426.jpg'
          }
        ],
        introduction: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        summary: [
          { max: 5, message: '字数不能超过250个', trigger: 'blur' }
        ],
        inventory:[
          { required: true, min: 0, message: '库存不能少于0个', trigger: 'blur' }
        ],
        marketPrice:[
          { required: true, min: 0, message: '价格不能少于0元', trigger: 'blur' }
        ],
        discountPrice:[
          { required: true, min: 0, message: '价格不能少于0元', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传封面图片', trigger: 'change' }
        ],
        images: [
          { type: 'array', required: true, message: '请至少上传一张图片', trigger: 'change' }
        ]
      }
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
    beforeUpload (file) {
      let isImageForm = this.imageForm(file)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isImageForm && isLt5M
    },
    handleAvatarSuccess (response, file, fileList) {
      if (response.code !== 0 || !response.data) {
        this.$message.error('上传失败' + response.msg)
        return
      }
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.image = './static/uploads/' + response.data.filename
    },
    async handleSuccess (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      if (response.code !== 0 || !response.data) {
        this.$message.error('上传失败' + response.msg)
        return
      }
      this.images = this.$refs.uploadMulti.uploadFiles
    },
    handleRemove (file, fileList) {
      console.log(file)
      console.log(fileList)
      let tmp = this.form.images
      let url = ''
      if( file.response ){
        url = './static/uploads/' + file.response.data[0].filename
      }else{
        url = file.url
      }
      try {
        for ( var i=0; i<tmp.length; i++) {
          if ( tmp[i].url == url ) {
            tmp.splice(tmp[i], 1)
            break
          }
        }
        console.log(tmp)
        this.form.images = tmp
      } catch (err) {
        console.log(err)
      }
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
    onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        console.log(valid)
        if (valid) {
          await this.productAdd()
          await this.$refs[formName].resetFields()
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async productAdd () {
      var newImages = [];
      for ( var i=0; i<this.images.length; i++) {
        if (!this.images[i].response){
          newImages.push({
            name: this.images[i].name,
            url: this.images[i].url
          })
        }else{
          newImages.push({
            name: this.images[i].response.data[0].originalname,
            url: './static/uploads/' + this.images[i].response.data[0].filename
          })
        }
      }
      this.images
      var form = {
        name: this.form.name,
        categoryId: this.form.categoryId,
        summary: this.form.summary,
        inventory: this.form.inventory,
        marketPrice: this.form.marketPrice,
        discountPrice: this.form.discountPrice,
        status: this.form.status,
        image: this.form.image,
        images: newImages,
        introduction: this.$refs.ue.getUEContent()
      }
      console.log(form)
      // await this.delay(0)
      // await this.$axios.post('/api/list/add', form)
      // await this.initData()
    },
    async initData (){
      var form = {
        name: '',
        categoryId: '',
        summary: '',
        inventory: 0,
        marketPrice: 0,
        discountPrice: 0,
        status: '',
        image: '',
        images: [],
        introduction: ''
      }
      this.form = form
      console.log(this.form)
    },
    delay (s) {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, s)
      })
    }
  }
}
</script>

<style scoped>
  .editor-container {
    margin-bottom: 18px;
  }
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
