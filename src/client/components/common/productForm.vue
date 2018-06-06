<template>
<div>
  <el-form ref="form" :model="data" :rules="rules" label-width="80px">
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="商品分类" prop="categoryId">
      <el-select v-model="data.categoryId" placeholder="请选择">
        <el-option
          v-for="item in categoryData"
          :key="item.contentId"
          :label="item.name"
          :value="item.contentId">
        </el-option>
      </el-select>
      <el-button type="primary" icon="add" @click="handleAdd">添加分类</el-button>
    </el-form-item>
    <el-form-item label="商品简介" prop="summary">
      <el-input v-model="data.summary"></el-input>
    </el-form-item>
    <el-form-item label="库存" prop="inventory">
      <el-input v-model="data.inventory"></el-input>
    </el-form-item>
    <el-form-item label="市场价格" prop="marketPrice">
      <el-input v-model="data.marketPrice"></el-input>
    </el-form-item>
    <el-form-item label="折扣价格" prop="discountPrice">
      <el-input v-model="data.discountPrice"></el-input>
    </el-form-item>
    <el-form-item label="商品状态">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">在售</el-radio>
        <el-radio :label="2">下架</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="首页轮播">
      <el-radio-group v-model="data.carousel">
        <el-radio :label="2"> 是 </el-radio>
        <el-radio :label="1"> 否 </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="首页新品">
      <el-radio-group v-model="data.new">
        <el-radio :label="2"> 是 </el-radio>
        <el-radio :label="1"> 否 </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="首页热销">
      <el-radio-group v-model="data.hot">
        <el-radio :label="2"> 是 </el-radio>
        <el-radio :label="1"> 否 </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
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
        <img v-else-if="data.image" :src="data.image" class="avatar">
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
        :file-list="data.images"
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
      <UE @ready="editorReady" :defaultMsg=defaultMsg :config=config ref="ue"></UE>
    </div>
    <el-form-item v-if="pageType === 'page'">
      <el-button type="primary" @click="onSubmit('form')">提交</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
  <div class="dialog-footer">
    <span v-if="pageType === 'dialog'">
      <el-button @click="$emit('closeEditDialog')">取 消</el-button>
      <el-button type="primary" @click="_saveEdit('form')">确 定</el-button>
    </span>
  </div>

  <!-- 编辑弹出框 -->
  <AddCategoryDialog
    :editVisible.sync="addVisible"
    @cancleDialog = "addVisible=false"
    @getCategoryData = "getCategoryData">
  </AddCategoryDialog>
</div>
</template>
<script>
import UE from './ue.vue'
import axios from '../../router/ajaxModel'
import AddCategoryDialog from '../common/addCategoryDialog.vue'
export default {
  name: 'ProductForm',
  components: {UE, AddCategoryDialog},
  data () {
    return {
      addVisible: false,
      categoryData: [],
      dialogImageUrl: '',
      dialogVisible: false,
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
        carousel: 1,
        new: 1,
        hot: 1,
        status: 1,
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
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ],
        marketPrice:[
          { required: true, message: '请输入商品市场价格', trigger: 'blur' }
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
  props: {
    pageType: {
      type: String //dialog 、page
    },
    saveEdit: {
      type: Function
    },
    closeEditDialog: {
      type: Function
    },
    formData: {
      type: Object
    }
  },
  computed: {
    data () {
      console.log(this.formData)
      return this.formData ? this.formData : this.form
    },
    defaultMsg () {
      return this.formData ? this.formData.introduction : '还没有编写商品详情哦，快来编写吧'
    }
  },
  mounted () {
    this.getCategoryData()
  },
  methods: {
    handleAdd () {
      this.addVisible = true
    },
    async getCategoryData () {
      var data = await axios.ajaxGet('/api/category/get')
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        this.categoryData = data.data.data
      }
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
    handleAvatarSuccess (response, file, fileList) {
      if (response.code !== 0 || !response.data) {
        this.$message.error('上传失败' + response.msg)
        return
      }
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.image = './static/uploads/' + response.data.filename
    },
    async handleSuccess (response, file, fileList) {
      if (response.code !== 0 || !response.data) {
        this.$message.error('上传失败' + response.msg)
        return
      }
      this.images = this.$refs.uploadMulti.uploadFiles
    },
    handleRemove (file, fileList) {
      console.log(file)
      console.log(fileList)
      let tmp = fileList
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
        this.form.images = tmp
      } catch (err) {
        console.log(err)
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name} ？`)
    },
    onSubmit (formName) {
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
      this.form.images = newImages

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.productAdd()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async productAdd () {

      var form = {
        name: this.form.name,
        categoryId: this.form.categoryId,
        summary: this.form.summary,
        inventory: this.form.inventory,
        marketPrice: this.form.marketPrice,
        discountPrice: this.form.discountPrice,
        carousel: this.form.carousel,
        new: this.form.new,
        hot: this.form.hot,
        status: this.form.status,
        image: this.form.image,
        images: this.form.images,
        introduction: this.form.introduction
      }
      console.log(form)
      var data = await axios.ajaxPost('/api/product/add', form)
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        await this.initData()
        await this.$message.success('提交成功！')
      }
    },
    async initData (){
      var form = {
        name: '',
        categoryId: '',
        summary: '',
        inventory: 0,
        marketPrice: 0,
        discountPrice: 0,
        carousel: 1,
        new: 1,
        hot: 1,
        status: 1,
        image: '',
        images: [],
        introduction: ''
      }
      this.form = form
      this.imageUrl = ''
      this.$refs.ue.setText('还没有编写商品详情哦，快来编写吧'); //ue是父级在组件上加的 ref="ue"属性
      this.images = []
    },
    // 保存编辑
    async _saveEdit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$emit('saveEdit',this.formData)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editorReady(instance) {
      if (this.formData) {
        instance.setContent(this.formData.introduction);
        instance.addListener('contentChange', () => {
          this.formData.introduction = instance.getContent();
        })
      } else {
        instance.setContent(this.form.introduction);
        instance.addListener('contentChange', () => {
          this.form.introduction = instance.getContent();
        })
      }
    },
    delay (s, next) {
      return new Promise(function (resolve, reject) {
        setTimeout(()=>{
          next()
          resolve()
        }, s)
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
  .dialog-footer {
    padding: 20px 0;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
