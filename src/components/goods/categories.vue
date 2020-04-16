<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="showadddialog">添加分类</el-button>
        </el-col>
      </el-row>
      <table-tree
        :data="categoriesData"
        :columns="columns"
        :show-index="true"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <template slot="likes" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted=true" style="color:green"></i>
          <i class="el-icon-error" v-if="scope.row.cat_deleted=false" style="color:green"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="info" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <template slot="caozuo">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </table-tree>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[4, 8, 10, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加商品分类" :visible.sync="adddialogVisible" width="50%" @close="addcateclose">
      <el-form
        ref="addformDataRes"
        :model="addformData"
        label-width="80px"
        :rules="addformDataRules"
      >
        <el-form-item label="父类名称" prop="cat_name">
          <el-input v-model="addformData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cascadervalue"
            :options="parentData"
            :props="cascaderprops"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcateForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getcategories()
  },
  data() {
    return {
      adddialogVisible: false,
      parentData: [],
      cascaderprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      cascadervalue: [],
      addformData: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addformDataRules: {
        cat_name: [
          { required: true, message: '请输入父类名称', trigger: 'blur' }
        ]
      },
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      categoriesData: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'likes'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'caozuo'
        }
      ]
    }
  },
  methods: {
    async getcategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categoriesData = res.data.result
      this.total = res.data.total
      console.log('res.data :', res.data)
    },
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getcategories()
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getcategories()
    },
    showadddialog() {
      this.adddialogVisible = true
      this.getparentcategories()
    },
    async getparentcategories() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentData = res.data
      console.log('object :', res.data)
    },
    handleChange() {
      console.log('this. :', this.cascadervalue)
      if (this.cascadervalue.length > 0) {
        this.addformData.cat_pid = this.cascadervalue[
          this.cascadervalue.length - 1
        ]
        this.addformData.cat_level = this.cascadervalue.length
      } else {
        this.addformData.cat_pid = 0
        this.addformData.cat_level = 0
      }
    },
    addcateclose() {
      this.$refs.addformDataRes.resetFields()
      this.cascadervalue = []
    },
    addcateForm() {
      this.$refs.addformDataRes.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        console.log('this. :', this.addformData)
        const { data: res } = await this.$http.post('categories', {
          cat_pid: this.addformData.cat_pid,
          cat_name: this.addformData.cat_name,
          cat_level: this.addformData.cat_level
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功')
        this.adddialogVisible = false
        this.getcategories()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.zk-table {
  margin-bottom: 15px;
}
</style>
