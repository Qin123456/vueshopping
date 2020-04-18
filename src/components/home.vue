<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button @click="emovetoken">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="fold" @click="togglefold">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :index="item.id +''" v-for="item in menusList" :key="item.id">
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="subtitem.path"
              v-for="subtitem in item.children"
              :key="subtitem.id"
              @click="saveNavState(subtitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subtitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menusList: [],
      icon: {
        125: 'iconfont icon-yonghu1',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-tianchongxing-',
        145: 'iconfont icon-iconfontpaixingbang'
      },
      iscollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getmenus()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    emovetoken() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getmenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
    },
    togglefold() {
      this.iscollapse = !this.iscollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    img {
      width: 50px;
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .fold {
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 5px;
    cursor: pointer;
  }
}
.el-main{
  background-color: #eaedf1;
  max-height: 892px;
}

.iconfont {
  margin-right: 10px;
}
</style>
