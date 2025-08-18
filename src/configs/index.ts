import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: "home",
    label: "首页",
    href: "/",
    icon: null,
  },
  {
    id: "history",
    label: "分析历史",
    href: "/history",
    icon: null,
  },
  {
    id: "profile",
    label: "个人中心",
    href: "/profile",
    icon: null,
  },
  {
    id: "help",
    label: "帮助",
    href: "/help",
    icon: null,
  },
  {
    id: "admin",
    label: "menu.admin",
    href: "/admin",
    icon: null,
  },
];

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: '1',
    title: '仪表板',
    icon: 'Odometer',
    path: '/admin/dashboard',
  },
  {
    id: '2',
    title: '用户管理',
    icon: 'User',
    path: '/admin/userManage',
  },
  {
    id: '3',
    title: '数据分析',
    icon: 'DataAnalysis',
    path: '/admin/analytics',
  },
  {
    id: '4',
    title: '音乐管理',
    icon: 'Headset',
    path: '/admin/music',
  },
  {
    id: '6',
    title: '系统设置',
    icon: 'Setting',
    path: '/admin/settings',
  }
]

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

  serverPath: import.meta.env.VITE_SERVER_PATH || '/api',
}
export default serverConfig
