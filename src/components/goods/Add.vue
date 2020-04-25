<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="添加商品信息" type="info" :closable="false" show-icon center></el-alert>
    <el-steps :active="activeindex-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addform" :rules="addformRules" ref="addformRef" label-position="top">
      <el-tabs
        v-model="activeindex"
        tabPosition="left"
        :before-leave="beforeTabLeave"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addform.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addform.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addform.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addform.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addform.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="itemcb"
                v-for="(itemcb, index) in item.attr_vals"
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
            :action="actionURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerstoken"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addform.goods_introduce"></quill-editor>
          <el-button type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-dialog :visible.sync="PreviewVisible" width="50%">
      <img :src="Previewpath" class="Previewimg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeindex: '0',
      addform: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addformRules: {
        goods_name: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTabData: [],
      onlyTabData: [],
      actionURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerstoken: {
        Authorization: window.sessionStorage.getItem('token')
      },
      PreviewVisible: false,
      Previewpath: ''
    }
  },
  methods: {
    async getcateData() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    handleChange() {
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addform.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async handleTabClick() {
      if (this.activeindex === '1') {
        const { data: res } = await this.$http.get(
          'categories/' + this.catId + '/attributes',
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
        console.log('res.data :', res.data)
      }
      if (this.activeindex === '2') {
        const { data: res } = await this.$http.get(
          'categories/' + this.catId + '/attributes',
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // res.data.forEach(item => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.onlyTabData = res.data
      }
    },
    handleSuccess(response) {
      const picinfo = { pic: response.data.tmp_path }
      this.addform.pics.push(picinfo)
    },
    handlePreview(file) {
      // const filepath= {file}
      this.PreviewVisible = true
      this.Previewpath = file.response.data.url
    },
    handleRemove(file) {
      console.log('object :>> ', file)
      const filepath = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x => x.pic === filepath)
      this.addform.pics.splice(i, 1)
    },
    add() {
      const form = _.cloneDeep(this.addform)
      form.goods_cat = form.goods_cat.join(',')
      console.log('object :>> ', this.manyTabData)
      this.manyTabData.forEach(item => {
        const newinfo = { attr_id: item.attr_id, attr_value: item.attr_value }
        this.addform.attrs.push(newinfo)
      })
      this.onlyTabData.forEach(item => {
        const newinfo = { attr_id: item.attr_id, attr_value: item.attr_value }
        this.addform.attrs.push(newinfo)
      })
      form.attrs = this.addform.attrs
      this.$refs.addformRef.validate(async valid => {
        if (!valid) this.$message.error('验证未通过')
        console.log('this.addForm :>> ', this.addform)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
    }
  },
  computed: {
    catId() {
      if (this.addform.goods_cat.length === 3) {
        return this.addform.goods_cat[2]
      }
      return null
    }
  },
  created() {
    this.getcateData()
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.Previewimg {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
