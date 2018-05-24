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
                        <el-input v-model="form.introduction"></el-input>
                    </el-form-item>
                    <el-form-item label="市场价格">
                        <el-input v-model="form.marketPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣价格">
                        <el-input v-model="form.discountPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态">
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
      form: {
        name: '',
        classify: '',
        introduction: '',
        marketPrice: '',
        discountPrice: '',
        image: '',
        images: []
      }
    }
  },
  methods: {
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
