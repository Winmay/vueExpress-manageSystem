<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有产品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table
              :data="data"
              stripe
              style="width: 100%"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
                <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column>
                <el-table-column header-align="center" align="center" prop="contentId" label="商品ID" width="60">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="name" label="商品名称" width="150">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="image" label="商品封面" width="100">
                  <template slot-scope="scope">
                    <img  :src="scope.row.image" alt="" style="width: 80px;height: 80px">
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" sortable prop="categoryId" label="商品分类" width="120">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="inventory" label="库存" width="70">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="marketPrice" label="市场价格" width="100">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="discountPrice" label="折扣价格" width="100">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="80%">
            <ProductForm
              :formData = "tableData[idx]"
              :pageType=pageType
              @closeEditDialog=_closeEditDialog
              @saveEdit=_saveEdit>
            </ProductForm>
        </el-dialog>

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
import ProductForm from '../common/productForm.vue'
import Dialog from '../common/dialog.vue'
export default {
  components: {ProductForm, Dialog},
  data () {
    return {
      pageType: 'dialog',
      tableData: [],
      totalPage: 0,
      cur_page: 1,
      multipleSelection: [],
      select_cate: '',
      select_word: '',
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      idx: -1
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    data () {
      return this.tableData
      /*
      return this.tableData.filter((d) => {
        let isDel = false
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          if (d.categoryId.indexOf(this.select_cate) > -1 &&
              (d.name.indexOf(this.select_word) > -1 ||
                  d.categoryId.indexOf(this.select_word) > -1)
          ) {
            return d
          }
        }
      })
      */
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    async getData () {
      // var data = await axios.ajaxGet('/api/product')
      var data = await axios.ajaxGet('/api/product/get', {
        params: {
          pageIndex: this.cur_page
        }
      })
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        this.tableData = data.data.data
        this.totalPage = data.data.count
        console.log(data.data)
      }
    },
    search () {
      this.is_search = true
    },
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.tableData[index]
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
    // 保存编辑
    async _saveEdit (form) {
      console.log(form)
      await this.$set(this.tableData, this.idx, form)
      await axios.ajaxPost('/api/product/mod', form)
      this.editVisible = false
      await this.$message.success(`修改第 ${this.idx + 1} 行成功`)
    },
    _closeEditDialog () {
      this.editVisible = false
    },
    delVisibleChange (val) {
      this.delVisible = val
    },
    // 确定删除
    async deleteRow () {
      console.log(this.idx)
      console.log(this.tableData[this.idx].contentId)
      await axios.ajaxPost('/api/product/del', {
        contentId: this.tableData[this.idx].contentId
      })
      await this.tableData.splice(this.idx, 1)
      await this.$message.success('删除成功')
      // await this.getData()
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
