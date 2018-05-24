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
                    <el-form-item label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-col :span="11">
                          <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="form.date"
                            style="width: 100%;"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                          </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="地址">
                      <el-cascader :options="options" v-model="form.address">
                      </el-cascader>
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
      options: [
        {
          value: '广东省',
          label: '广东省',
          children: [
            {
              value: '广州市',
              label: '广州市',
              children: [
                {
                  value: '天河区',
                  label: '天河区'
                },
                {
                  value: '海珠区',
                  label: '海珠区'
                }
              ]
            },
            {
              value: '东莞市',
              label: '东莞市',
              children: [
                {
                  value: '长安镇',
                  label: '长安镇'
                },
                {
                  value: '虎门镇',
                  label: '虎门镇'
                }
              ]
            }
          ]
        },
        {
          value: '湖南省',
          label: '湖南省',
          children: [
            {
              value: '长沙市',
              label: '长沙市',
              children: [
                {
                  value: '岳麓区',
                  label: '岳麓区'
                }
              ]
            }
          ]
        }
      ],
      form: {
        name: '',
        date: '',
        address: []
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
