<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>产品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">添加分类</el-button>
                <el-button type="danger" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>
            <el-table
              :data="data"
              stripe
              style="width: 100%"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
                <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column>
                <el-table-column header-align="center" align="center" prop="contentId" label="分类ID" width="60">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="name" label="分类名称">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="productCount" label="产品数" width="100">
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="!addVisible ? '编辑' : '添加'" :visible.sync="editVisible" width="80%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleDialog">取 消</el-button>
                <el-button type="primary" @click="() => !addVisible ? saveEdit() : addCategory()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <Dialog 
          :delVisible.sync="delVisible"
          @deleteRow="deleteRow"
          @cancleDialog="delVisible = false">
        </Dialog>
    </div>
</template>

<script>
import axios from '../../router/ajaxModel'
import Dialog from '../common/dialog.vue'
export default {
  components: {Dialog},
  data () {
    return {
      tableData: [],
      totalPage: 0,
      cur_page: 1,
      multipleSelection: [],
      del_list: [],
      editVisible: false,
      delVisible: false,
      addVisible: false,
      form: {
        name: ''
      },
      idx: -1
    }
  },
  created () {
    this.getCategoryData()
  },
  computed: {
    data () {
      return this.tableData.filter((d) => {
        let isDel = false
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            isDel = true
            break
          }
        }
        return d
      })
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getCategoryData()
    },
    // 获取 easy-mock 的模拟数据
    async getCategoryData () {
      var data = await axios.ajaxGet('/api/category/get')
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        this.tableData = data.data.data
        this.totalPage = data.data.count
        console.log(data.data)
      }
    },
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleAdd () {
      this.form.name = ''
      this.addVisible = true
      this.editVisible = true
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.tableData[index]
      this.form = item
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      const length = this.multipleSelection.length
      let str = ''
      this.del_list = this.del_list.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error('删除了' + str)
      this.multipleSelection = []
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cancleDialog () {
      this.editVisible = false
      this.addVisible = false
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
        this.editVisible = false
        this.addVisible = false
        this.getCategoryData()
      }
    },
    // 保存编辑
    async saveEdit () {
      console.log('editCategory')
      await this.$set(this.tableData, this.idx, this.form)
      await axios.ajaxPost('/api/category/mod', this.form)
      this.editVisible = false
      await this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.form = {
        name: ''
      }
    },
    // 确定删除
    async deleteRow () {
      console.log(this.idx)
      console.log(this.tableData[this.idx].contentId)
      await axios.ajaxPost('/api/category/del', {
        contentId: this.tableData[this.idx].contentId
      })
      await this.tableData.splice(this.idx, 1)
      await this.$message.success('删除成功')
      this.delVisible = false
    }
  }
}

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
