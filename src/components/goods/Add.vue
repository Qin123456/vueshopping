<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="消息提示的文案" type="info" show-icon center></el-alert>
      <el-steps :active="activeName-0" finish-status="success" :space="200" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeName"
          tab-position="left"
          :before-leave="beforeTabsleave"
          @tab-click="TabhandleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="catelistProps"
                @change="catehandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemck"
                  v-for="(itemck, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="subaddForm">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="previewdialogVisible" width="50%">
      <img :src="previewpath" class="previewimg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      catelistProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTabData: [],
      onlyTabData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewdialogVisible: false,
      previewpath: ''
    }
  },
  created() {
    this.getcate()
  },
  methods: {
    async getcate() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catelist = res.data
    },
    catehandleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabsleave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async TabhandleClick() {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(
          'categories/' + this.catId + '/attributes',
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTabData = res.data
      }
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          'categories/' + this.catId + '/attributes',
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTabData = res.data
        console.log('res.data :', res.data)
      }
    },
    handlesuccess(response) {
      const picinfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picinfo)
    },
    handlePreview(file) {
      console.log('file :', file)
      this.previewdialogVisible = true
      this.previewpath = file.response.data.url
    },
    handleRemove(file) {
      const filepath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filepath)
      this.addForm.pics.splice(i, 1)
    },
    subaddForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTabData.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newinfo)
        })
        this.onlyTabData.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newinfo)
        })
        form.attrs = this.addForm.attrs
        console.log('form :', form)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
    }
  },
  computed: {
    catId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin-bottom: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
