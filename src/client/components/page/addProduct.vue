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
        <ProductForm :pageType=pageType></ProductForm>
      </div>
    </div>
  </div>
</template>

<script>
import ProductForm from '../common/productForm.vue'
export default {
  components: {ProductForm},
  data: function () {
    return {
      pageType: 'page'
    }
  }
}
</script>
