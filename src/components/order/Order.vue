<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="8">
        <el-input v-model="queryinfo.query" placeholder="请输入内容" clearable @clear="getOrders">
          <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="rodersList.goods" style="width: 100%" border>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status!=='0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.pay_status ==='0'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time|timemoment}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-s-help" @click="prrogress"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rodersList.total"
    ></el-pagination>
    <el-dialog title="物流消息" :visible.sync="prrogressVisible" width="50%">
      <el-timeline>
        <el-timeline-item v-for="item in kuaidiList" :key="item.id" :timestamp="item.time">{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
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
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      rodersList: [],
      prrogressVisible: false,
      kuaidiList: []
    }
  },
  methods: {
    async getOrders() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rodersList = res.data
    },
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getOrders()
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getOrders()
    },
    async prrogress() {
      this.prrogressVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.kuaidiList = res.data
      console.log('res.data :>> ', res.data)
    }
  },
  created() {
    this.getOrders()
  }
}
</script>
