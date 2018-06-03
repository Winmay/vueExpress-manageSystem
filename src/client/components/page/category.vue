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
                <el-button type="primary" icon="add" class="handle-del mr10" @click="handleAdd">添加分类</el-button>
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
        <AddCategoryDialog
          :addVisible.sync="addVisible"
          :editVisible.sync="editVisible"
          :formData = "!addVisible ? tableData[idx] : null"
          @cancleDialog = "cancleDialog"
          @saveEdit = "saveEdit"
          @getCategoryData = "getCategoryData">
        </AddCategoryDialog>

        <!-- 删除提示框 -->
        <Dialog 
          :delVisible.sync="delVisible"
          @deleteRow="deleteRow"
          @delVisibleChange="delVisibleChange"
          @cancleDialog="delVisible = false">
        </Dialog>
    </div>
</template>

<script>
import axios from '../../router/ajaxModel'
import Dialog from '../common/dialog.vue'
import AddCategoryDialog from '../common/addCategoryDialog.vue'
export default {
  components: {Dialog, AddCategoryDialog},
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
      idx: -1
    }
  },
  activated () {
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
      this.addVisible = true
      this.editVisible = true
      // console.log(this.addVisible)
    },
    handleEdit (index, row) {
      this.idx = index
      this.editVisible = true
      // console.log(this.addVisible)
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
    delVisibleChange (val) {
      this.delVisible = val
    },
    // 保存编辑
    async saveEdit (form) {
      console.log('editCategory')
      await this.$set(this.tableData, this.idx, form)
      await axios.ajaxPost('/api/category/mod', form)
      this.editVisible = false
      await this.$message.success(`修改第 ${this.idx + 1} 行成功`)
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
