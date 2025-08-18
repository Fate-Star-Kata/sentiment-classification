<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 用户数据类型定义
interface User {
  id: number
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  role: 'user' | 'admin'
  registerTime: string
  lastLogin: string
}

// 表单数据类型
interface UserForm {
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  role: 'user' | 'admin'
  password?: string
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单相关
const formRef = ref<FormInstance>()
const userForm = ref<UserForm>({
  username: '',
  email: '',
  phone: '',
  status: 'active',
  role: 'user',
  password: ''
})

// 模拟用户数据
const users = ref<User[]>([
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    role: 'user',
    registerTime: '2024-01-15 10:30:00',
    lastLogin: '2024-01-20 14:25:00'
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'active',
    role: 'admin',
    registerTime: '2024-01-10 09:15:00',
    lastLogin: '2024-01-20 16:45:00'
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 'inactive',
    role: 'user',
    registerTime: '2024-01-08 11:20:00',
    lastLogin: '2024-01-18 09:30:00'
  }
])

// 表单验证规则
const rules: FormRules<UserForm> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 计算属性 - 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  return users.value.filter(user =>
    user.username.includes(searchKeyword.value) ||
    user.email.includes(searchKeyword.value) ||
    user.phone.includes(searchKeyword.value)
  )
})

// 分页数据
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 方法
function handleSearch() {
  currentPage.value = 1
  total.value = filteredUsers.value.length
}

function handleAdd() {
  isEdit.value = false
  userForm.value = {
    username: '',
    email: '',
    phone: '',
    status: 'active',
    role: 'user',
    password: ''
  }
  dialogVisible.value = true
}

function handleEdit(user: User) {
  isEdit.value = true
  userForm.value = {
    username: user.username,
    email: user.email,
    phone: user.phone,
    status: user.status,
    role: user.role
  }
  dialogVisible.value = true
}

function handleDelete(user: User) {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.username}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      ElMessage.success('删除成功')
      total.value = filteredUsers.value.length
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

function handleStatusChange(user: User) {
  ElMessage.success(`用户状态已${user.status === 'active' ? '启用' : '禁用'}`)
}

function handleSubmit() {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑用户逻辑
          ElMessage.success('用户信息更新成功')
        } else {
          // 添加用户逻辑
          const newUser: User = {
            id: Date.now(),
            username: userForm.value.username,
            email: userForm.value.email,
            phone: userForm.value.phone,
            status: userForm.value.status,
            role: userForm.value.role,
            registerTime: new Date().toLocaleString(),
            lastLogin: '-'
          }
          users.value.unshift(newUser)
          ElMessage.success('用户添加成功')
        }

        loading.value = false
        dialogVisible.value = false
        total.value = filteredUsers.value.length
      }, 1000)
    }
  })
}

function handleCancel() {
  dialogVisible.value = false
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

onMounted(() => {
  total.value = users.value.length
})
</script>

<template>
  <div class="user-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <p class="page-description">管理系统用户信息，包括用户的基本信息、状态和权限设置</p>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索用户名、邮箱或手机号" clearable @input="handleSearch"
          style="width: 300px">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <div class="actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          添加用户
        </el-button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <el-table :data="paginatedUsers" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="active" inactive-value="inactive"
              @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="160" />
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
    </div>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="500px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-manage {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  color: #6b7280;
  margin: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.search-box {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  gap: 12px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>