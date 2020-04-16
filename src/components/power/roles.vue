<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="rolesdialog=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesData" style="width: 100%" stripe border>
        <el-table-column type="expand" label="展开" width="70">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id" class="center">
              <el-col :span="5">
                <el-tag closable @close="removetag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id" class="center">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removetag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="info"
                      closable
                      @close="removetag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="70"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="分配权限">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="openRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteroles(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              @click="showrightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="rolesdialog"
      width="50%"
      @close="resetolesForm('rolesFormRef')"
    >
      <el-form ref="rolesFormRef" :model="rolesForm" :rules="rolesFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="addReset">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="updaterolesdialog"
      width="50%"
      @close="resetolesForm('updaterolesDataRes')"
    >
      <el-form
        :model="updaterolesData"
        :rules="updaterolesRules"
        ref="updaterolesDataRes"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色id" prop="name">
          <el-input :disabled="true" v-model="updaterolesData.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updaterolesData.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updaterolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updaterolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="updateroles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="rightsDialog" width="50%" @close="rightsclose">
      <el-tree
        :data="rightsdata"
        :props="rightsdefaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultkey"
        ref="rightsRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allocationroles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRoles()
  },
  data() {
    return {
      rolesData: [],
      rightsdata: [],
      rightsdefaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultkey: [],
      toleid: '',
      updaterolesData: {},
      updaterolesRules: {
        roleName: [{ required: true, message: '请输入角色', trigger: 'blur' }]
      },
      rolesdialog: false,
      updaterolesdialog: false,
      rightsDialog: false,
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入权角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesData = res.data
    },
    removetag(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'roles/' + role.id + '/rights/' + rightId + ''
          )
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          role.children = res.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetolesForm(formname) {
      this.$refs[formname].resetFields()
    },
    addReset() {
      this.$refs.rolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        const { data: res } = await this.$http.post('roles', this.rolesForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.getRoles()
        this.rolesdialog = false
      })
    },
    async openRoles(id) {
      this.updaterolesdialog = true
      const { data: res } = await this.$http.get('roles/' + id + '')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.updaterolesData = res.data
    },
    updateroles() {
      this.$refs.updaterolesDataRes.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        const { data: res } = await this.$http.put(
          'roles/' + this.updaterolesData.roleId + '',
          {
            roleName: this.updaterolesData.roleName,
            roleDesc: this.updaterolesData.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.updaterolesdialog = false
        this.$message.success('修改角色成功')
        this.getRoles()
      })
    },
    deleteroles(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRoles()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showrightsDialog(role) {
      this.rightsDialog = true
      this.toleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log('res.data :', res.data)
      this.rightsdata = res.data
      this.getlestkeys(role, this.defaultkey)
    },
    getlestkeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getlestkeys(item, arr)
      })
    },
    rightsclose() {
      this.defaultkey = []
    },
    async allocationroles() {
      const keys = [
        ...this.$refs.rightsRef.getCheckedKeys(),
        ...this.$refs.rightsRef.getHalfCheckedKeys()
      ]
      const id = keys.join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.toleid + '/rights',
        { rids: id }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功')
      this.rightsDialog = false
      this.getRoles()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 0 5px;
}
.center {
  display: flex;
  align-items: center;
}
</style>
