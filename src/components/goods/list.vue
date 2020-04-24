<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryinfo.query" placeholder="请输入内容" clearable @clear="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist.goods" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time|timemoment}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="goodsSizeChange"
        @current-change="goodsCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodslist.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  filters: {
    timemoment(val) {
      return moment(val).format('lll')
    }
  },
  created() {
    this.getGoods()
  },
  data() {
    return {
      goodslist: [],
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  methods: {
    async getGoods() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodslist = res.data
      console.log('res.data :', res.data)
    },
    goodsCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getGoods()
    },
    goodsSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getGoods()
    },
    goAddpage() {
      this.$router.push('/home/add')
    }
  }
}
</script>
