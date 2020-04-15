<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userstatechange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="showeditdialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="opendeletemeabox(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="Top Center 分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-s-tools"
                circle
                @click="showrolesdialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="queryinfo.pagesize"
        :page-sizes="[1, 2, 6, 8]"
        :current-page="queryinfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="adddialogVisible" @close="adddialogclose" width="50%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFromRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="editdialogVisible" width="50%" @close="editdialogclose">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="rolesdialogVisible" width="50%" @close="closeroles">
      <div>
        <p>当前用户：{{userinfo.username}}</p>
        <p>当前角色：{{userinfo.roles_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectId" placeholder="请选择">
            <el-option
              v-for="item in rolesData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveinforoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getuserlist()
  },
  data() {
    var checkemail = (rule, value, callback) => {
      const regemail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      if (regemail.test(value)) {
        return callback()
      }
      callback(new Error('邮箱不合法'))
    }
    var checkmobile = (rule, value, callback) => {
      const regmobile = /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})$/
      if (regmobile.test(value)) return callback()
      callback(new Error('手机号不合法'))
    }
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userinfo: {
        username: '',
        roles_name: '',
        userid: ''
      },
      total: 0,
      userlist: [],
      rolesData: [],
      selectId: '',
      adddialogVisible: false,
      editdialogVisible: false,
      rolesdialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromRules: {
        username: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(SizeChange) {
      this.queryinfo.pagesize = SizeChange
      this.getuserlist()
    },
    handleCurrentChange(CurrentChange) {
      this.queryinfo.pagenum = CurrentChange
      this.getuserlist()
    },
    async userstatechange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        'users/' + userinfo.id + '/state/' + userinfo.mg_state + ''
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    adddialogclose() {
      this.$refs.addFormRef.resetFields()
    },
    adduser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('验证未通过')
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.adddialogVisible = false
        this.getuserlist()
      })
    },
    async showeditdialog(id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('users/' + id + '')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    editdialogclose() {
      this.$refs.editFormRef.resetFields()
    },
    edituser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('验证未通过')
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改成功')
        this.editdialogVisible = false
        this.getuserlist()
      })
    },
    opendeletemeabox(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        ddd: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getuserlist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showrolesdialog(userinfo) {
      this.rolesdialogVisible = true
      this.userinfo.userid = userinfo.id
      this.userinfo.username = userinfo.username
      this.userinfo.roles_name = userinfo.role_name
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesData = res.data
    },
    async saveinforoles() {
      if (!this.selectId) return this.$message.warning('请选择角色')
      const { data: res } = await this.$http.put(
        'users/' + this.userinfo.userid + '/role',
        {
          rid: this.selectId
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配角色成功')
      this.getuserlist()
      this.rolesdialogVisible = false
    },
    closeroles() {
      this.selectId = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb,
.el-row {
  margin-bottom: 15px;
}
.el-table {
  margin-bottom: 15px;
}
</style>
