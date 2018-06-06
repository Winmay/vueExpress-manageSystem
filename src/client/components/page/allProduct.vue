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
                <el-button type="danger" icon="delete" class="handle-del mr10 paddingDiv" @click="delAll">批量删除</el-button>
                <el-select clearable @clear="clearSearch" @change="selectSearch('categoryId')" v-model="selectCategory" placeholder="筛选分类" class="handle-select mr10 paddingDiv">
                    <el-option
                      v-for="item in categoryData"
                      :key="item.contentId"
                      :label="item.name"
                      :value="item.contentId">
                    </el-option>
                </el-select>
                <el-select clearable @clear="clearSearch" @change="selectSearch('carousel')" v-model="selectCarousel" placeholder="首页轮播" class="handle-select mr10 paddingDiv">
                    <el-option key="2" label="是" value="2">
                    </el-option>
                </el-select>
                <el-select clearable @clear="clearSearch" @change="selectSearch('new')" v-model="selectNew" placeholder="首页新品" class="handle-select mr10 paddingDiv">
                    <el-option key="2" label="是" value="2">
                    </el-option>
                </el-select>
                <el-select clearable @clear="clearSearch" @change="selectSearch('hot')" v-model="selectHot" placeholder="首页热销" class="handle-select mr10 paddingDiv">
                    <el-option key="2" label="是" value="2">
                    </el-option>
                </el-select>
                <div class="paddingDiv">
                  <el-input clearable @clear="clearSearch" v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                  <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
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
                  <template slot-scope="scope">
                    <template v-for="item in categoryData" v-if="item.contentId === scope.row.categoryId" >
                      {{ item.name }}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="inventory" label="库存(件)" width="70">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="marketPrice" label="市场价格(元)" width="100">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="discountPrice" label="折扣价格(元)" width="100">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="status" label="状态" width="50">
                  <template slot-scope="scope">
                    {{ scope.row.status === 1 ? '在售' : '下架' }}
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="carousel" label="首页轮播" width="80">
                  <template slot-scope="scope">
                    {{ scope.row.carousel === 1 ? '' : '是' }}
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="new" label="首页新品" width="80">
                  <template slot-scope="scope">
                    {{ scope.row.new === 1 ? '' : '是' }}
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="hot" label="首页热销" width="80">
                  <template slot-scope="scope">
                    {{ scope.row.hot === 1 ? '' : '是' }}
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <div class="el-dialog__wrapper" style="background: rgba(0,0,0,.5)" v-if="editVisible">
          <div class="el-dialog" style="width: 80%; margin-top: 15vh;">
              <div class="el-dialog__header">
                <span class="el-dialog__title">编辑</span>
                <button @click=_closeEditDialog type="button" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              </div>
              <div class="el-dialog__body">
                <ProductForm
                  :formData = "tableData[idx]"
                  :pageType=pageType
                  @closeEditDialog=_closeEditDialog
                  @saveEdit=_saveEdit>
                </ProductForm>
              </div>
          </div>
        </div>

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
import msg from '../../router/messageBox'
import axios from '../../router/ajaxModel'
import ProductForm from '../common/productForm.vue'
import Dialog from '../common/dialog.vue'
export default {
  components: {ProductForm, Dialog},
  mixins: [msg],
  data () {
    return {
      pageType: 'dialog',
      tableData: [],
      categoryData: [],
      totalPage: 0,
      cur_page: 1,
      cursearch_page: 1,
      currentPage: 1,
      multipleSelection: [],
      selectCategory: '',
      selectCarousel: '',
      selectNew: '',
      selectHot: '',
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
    this.getCategoryData()
  },
  computed: {
    data () {
      // return this.tableData
      
      return this.tableData.filter((d) => {
        let isDel = false
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          return d
        }
      })
      
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      if ( this.is_search ) {
        this.cursearch_page = val
      } else {
        this.cur_page = val
        this.getData()
      }
      this.currentPage = val
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
    async getCategoryData () {
      var data = await axios.ajaxGet('/api/category/get')
      if (data.code !== 0) {
        await this.$message.error(data.msg)
      } else {
        this.categoryData = data.data.data
      }
    },
    async searchApi (keywords, name) {
      console.log(keywords)
      var data = await axios.ajaxGet('/api/product/search', {
        params: {
          pageIndex: this.cursearch_page,
          keywords: keywords,
          name: name
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
    async search () {
      this.is_search = true
      let keywords = ''
      if (this.select_word) {
        keywords = this.select_word
      } else {
        this.$message.error('请输入需要搜索的数据')
        return
      }
      await this.searchApi(keywords, 'name')
    },
    async selectSearch (type) {
      console.log(type)
      this.is_search = true
      let keywords = ''
      if (this.selectCategory) {
        keywords = this.selectCategory
      } else if (this.selectCarousel) {
        keywords = this.selectCarousel
      } else if (this.selectNew) {
        keywords = this.selectNew
      } else if (this.selectHot) {
        keywords = this.selectHot
      } else {
        return
      }
      await this.searchApi(keywords, type)
    },
    clearSearch () {
      console.log('clearSearch')
      this.is_search = false
      this.handleCurrentChange(this.cur_page)
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
    async delAll () {
      const length = this.multipleSelection.length
      if( length <= 0){
        this.$message.error('请选择需要删除的数据')
        return;
      }
      let isOk = await this.confirm('此操作将永久删除该文件, 是否继续?')
      if (isOk) {
        let str = ''
        this.del_list = this.del_list.concat(this.multipleSelection)
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].name + ' '
        }
        await axios.ajaxPost('/api/product/delAll', {
          delAll: length === this.tableData.length,
          delData: this.multipleSelection
        })
        this.$message.error('删除了' + str)
        this.multipleSelection = []
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    async _saveEdit (form) {
      console.log(form)
      await this.$set(this.tableData, this.idx, form)
      await axios.ajaxPost('/api/product/mod', form)
      await this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.editVisible = false
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
    .paddingDiv {
      margin: 5px 0;
    }
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
