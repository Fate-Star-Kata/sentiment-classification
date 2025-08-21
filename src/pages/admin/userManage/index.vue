<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getUsersAPI, addUserAPI, editUserAPI, deleteUserAPI, userDetailAPI } from '@/api/admin/users'
import type { User, UserQueryParams } from '@/types/components/admin'

// 表单数据类型
interface UserForm {
  username: string
  email: string
  phone?: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
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
  is_active: true,
  is_staff: false,
  is_superuser: false,
  password: ''
})

// 用户数据
const users = ref<User[]>([])

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
    user.email.includes(searchKeyword.value)
  )
})

// 分页数据
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 获取用户列表
async function fetchUsers() {
  try {
    loading.value = true
    const params: UserQueryParams = {
      query: searchKeyword.value,
      page: currentPage.value,
      page_size: pageSize.value
    }

    const response = await getUsersAPI(params)
    if (response.data) {
      users.value = response.data.users || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 方法
function handleSearch() {
  currentPage.value = 1
  fetchUsers()
}

function handleAdd() {
  isEdit.value = false
  userForm.value = {
    username: '',
    email: '',
    phone: '',
    is_active: true,
    is_staff: false,
    is_superuser: false,
    password: ''
  }
  dialogVisible.value = true
}

function handleEdit(user: User) {
  isEdit.value = true
  userForm.value = {
    username: user.username,
    email: user.email,
    phone: '',
    is_active: user.is_active,
    is_staff: user.is_staff,
    is_superuser: user.is_superuser
  }
  dialogVisible.value = true
}

async function handleDelete(user: User) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    if (user.id) {
      await deleteUserAPI(user.id)
      ElMessage.success('删除成功')
      fetchUsers()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败，请重试')
    } else {
      ElMessage.info('已取消删除')
    }
  }
}

async function handleStatusChange(user: User) {
  try {
    if (user.id) {
      await editUserAPI(user)
      ElMessage.success(`用户状态已${user.is_active ? '启用' : '禁用'}`)
      fetchUsers()
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
    ElMessage.error('更新用户状态失败，请重试')
    // 恢复原状态
    user.is_active = !user.is_active
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      loading.value = true

      if (isEdit.value) {
        // 编辑用户逻辑
        await editUserAPI(userForm.value as User)
        ElMessage.success('用户信息更新成功')
      } else {
        // 添加用户逻辑
        await addUserAPI(userForm.value as Omit<User, 'id'>)
        ElMessage.success('用户添加成功')
      }

      dialogVisible.value = false
      fetchUsers()
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(isEdit.value ? '更新用户失败，请重试' : '添加用户失败，请重试')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  dialogVisible.value = false
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchUsers()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
});</script>

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
        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.is_active" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="is_staff" label="员工" width="80">
          <template #default="{ row }">
            <el-tag :type="row.is_staff ? 'success' : 'info'">
              {{ row.is_staff ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_superuser" label="超级用户" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_superuser ? 'danger' : 'info'">
              {{ row.is_superuser ? '是' : '否' }}
            </el-tag>
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

        <el-form-item label="状态">
          <el-switch v-model="userForm.is_active" active-text="启用" inactive-text="禁用" />
        </el-form-item>
        <el-form-item label="员工权限">
          <el-switch v-model="userForm.is_staff" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="超级用户">
          <el-switch v-model="userForm.is_superuser" active-text="是" inactive-text="否" />
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