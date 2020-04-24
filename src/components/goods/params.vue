<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="只允许为第三集分类设置相关参数" show-icon type="warning" :closable="false"></el-alert>
      <el-row class="cate">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="catevalue"
            :options="cateDataList"
            :props="cateprops"
            @change="cateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isShowBut" @click="addDialog">添加参数</el-button>
            </el-col>
          </el-row>
          <el-table stripe border :data="paramslist" style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="taghandleClose(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="selectparams(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isShowBut" @click="addDialog">添加参数</el-button>
            </el-col>
          </el-row>
          <el-table stripe border :data="paramslist" style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="taghandleClose(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="selectparams(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="closeaddDialog"
    >
      <el-form ref="addformRes" :model="addform" :rules="addformRules" label-width="80px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+this.titleText"
      :visible.sync="updatedialogVisible"
      width="50%"
      @close="updatadialogclose"
    >
      <el-input v-model="selectParamsData.attr_name" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateData()
  },
  data() {
    return {
      selectParamsData: {},
      adddialogVisible: false,
      updatedialogVisible: false,
      addform: {
        attr_name: ''
      },
      addformRules: {
        attr_name: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }
        ]
      },
      paramslist: [],
      activeName: 'many',
      cateDataList: [],
      catevalue: [],
      cateprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    async getCateData() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateDataList = res.data
    },
    cateChange() {
      this.getParamsData()
    },
    handleClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.catevalue.length !== 3) {
        this.catevalue = []
        this.paramslist = []
        return
      }
      const { data: res } = await this.$http.get(
        'categories/' + this.cateId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.paramslist = res.data
      console.log('res.data :', res.data)
    },
    addDialog() {
      this.adddialogVisible = true
    },
    closeaddDialog() {
      this.$refs.addformRes.resetFields()
    },
    addparams() {
      this.$refs.addformRes.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        const { data: res } = await this.$http.post(
          'categories/' + this.cateId + '/attributes',
          { attr_name: this.addform.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.adddialogVisible = false
      })
    },
    async selectparams(attrid) {
      this.updatedialogVisible = true
      const { data: res } = await this.$http.get(
        'categories/' + this.cateId + '/attributes/' + attrid + '',
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error(res.status.msg)
      this.selectParamsData = res.data
    },
    updatadialogclose() {
      this.selectParamsData = {}
    },
    async updateparams() {
      if (this.selectParamsData.attr_name === '') {
        this.$message.error('验证未通过')
      } else {
        const { data: res } = await this.$http.put(
          'categories/' +
            this.cateId +
            '/attributes/' +
            this.selectParamsData.attr_id +
            '',
          {
            attr_name: this.selectParamsData.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.updatedialogVisible = false
        this.getParamsData()
      }
    },
    deleteparams(attrid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'categories/' + this.cateId + '/attributes/' + attrid + ''
          )
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async saveattrals(row) {
      const { data: res } = await this.$http.put(
        'categories/' + this.cateId + '/attributes/' + row.attr_id + '',
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveattrals(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    taghandleClose(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveattrals(row)
    }
  },
  computed: {
    isShowBut() {
      if (this.catevalue.length === 3) return false
      return true
    },
    cateId() {
      if (this.catevalue.length === 3) return this.catevalue[2]
      return null
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态参数'
    }
  }
}
</script>
<style lang="less" scoped>
.cate {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
</style>
