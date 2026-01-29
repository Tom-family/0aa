import { createWebHistory, createRouter } from "vue-router";
/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/views/index"),
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile/:activeTab?",
        component: () => import("@/views/system/user/profile/index"),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" },
      },
    ],
  },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  // {
  //   path: "/system/user-auth",
  //   component: Layout,
  //   hidden: true,
  //   permissions: ["system:user:edit"],
  //   children: [
  //     {
  //       path: "role/:userId(\\d+)",
  //       component: () => import("@/views/system/user/authRole"),
  //       name: "AuthRole",
  //       meta: { title: "分配角色", activeMenu: "/system/user" },
  //     },
  //   ],
  // },
  // {
  //   path: "/system/role-auth",
  //   component: Layout,
  //   hidden: true,
  //   permissions: ["system:role:edit"],
  //   children: [
  //     {
  //       path: "user/:roleId(\\d+)",
  //       component: () => import("@/views/system/role/authUser"),
  //       name: "AuthUser",
  //       meta: { title: "分配用户", activeMenu: "/system/role" },
  //     },
  //   ],
  // },
  // {
  //   path: "/system/dict-data",
  //   component: Layout,
  //   hidden: true,
  //   permissions: ["system:dict:list"],
  //   children: [
  //     {
  //       path: "index/:dictId(\\d+)",
  //       component: () => import("@/views/system/dict/data"),
  //       name: "Data",
  //       meta: { title: "字典数据", activeMenu: "/system/dict" },
  //     },
  //   ],
  // },
  // {
  //   path: "/monitor/job-log",
  //   component: Layout,
  //   hidden: true,
  //   permissions: ["monitor:job:list"],
  //   children: [
  //     {
  //       path: "index/:jobId(\\d+)",
  //       component: () => import("@/views/monitor/job/log"),
  //       name: "JobLog",
  //       meta: { title: "调度日志", activeMenu: "/monitor/job" },
  //     },
  //   ],
  // },
  // {
  //   path: "/tool/gen-edit",
  //   component: Layout,
  //   hidden: true,
  //   permissions: ["tool:gen:edit"],
  //   children: [
  //     {
  //       path: "index/:tableId(\\d+)",
  //       component: () => import("@/views/tool/gen/editTable"),
  //       name: "GenEdit",
  //       meta: { title: "修改生成配置", activeMenu: "/tool/gen" },
  //     },
  //   ],
  // },
  {
    name: "Chongqing",
    path: "/chongQing",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "重庆养心殿7大关系管理",
      icon: "system",
      noCache: false,
      link: null,
    },
    children: [
      {
        name: "Relation",
        path: "relation",
        hidden: false,
        component: "chongQing/relation/index",
        meta: {
          title: "关系管理",
          icon: "user",
          noCache: false,
          link: null,
        },
      },
    ],
  },
  {
    name: "System",
    path: "/system",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "系统管理",
      icon: "system",
      noCache: false,
      link: null,
    },
    children: [
      {
        name: "User",
        path: "user",
        hidden: false,
        component: "system/user/index",
        meta: {
          title: "用户管理",
          icon: "user",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Role",
        path: "role",
        hidden: false,
        component: "system/role/index",
        meta: {
          title: "角色管理",
          icon: "peoples",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Menu",
        path: "menu",
        hidden: false,
        component: "system/menu/index",
        meta: {
          title: "菜单管理",
          icon: "tree-table",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Dept",
        path: "dept",
        hidden: false,
        component: "system/dept/index",
        meta: {
          title: "部门管理",
          icon: "tree",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Post",
        path: "post",
        hidden: false,
        component: "system/post/index",
        meta: {
          title: "岗位管理",
          icon: "post",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Dict",
        path: "dict",
        hidden: false,
        component: "system/dict/index",
        meta: {
          title: "字典管理",
          icon: "dict",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Config",
        path: "config",
        hidden: false,
        component: "system/config/index",
        meta: {
          title: "参数设置",
          icon: "edit",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Notice",
        path: "notice",
        hidden: false,
        component: "system/notice/index",
        meta: {
          title: "通知公告",
          icon: "message",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Log",
        path: "log",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "日志管理",
          icon: "log",
          noCache: false,
          link: null,
        },
        children: [
          {
            name: "Operlog",
            path: "operlog",
            hidden: false,
            component: "monitor/operlog/index",
            meta: {
              title: "操作日志",
              icon: "form",
              noCache: false,
              link: null,
            },
          },
          {
            name: "Logininfor",
            path: "logininfor",
            hidden: false,
            component: "monitor/logininfor/index",
            meta: {
              title: "登录日志",
              icon: "logininfor",
              noCache: false,
              link: null,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Monitor",
    path: "/monitor",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "系统监控",
      icon: "monitor",
      noCache: false,
      link: null,
    },
    children: [
      {
        name: "Online",
        path: "online",
        hidden: false,
        component: "monitor/online/index",
        meta: {
          title: "在线用户",
          icon: "online",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Job",
        path: "job",
        hidden: false,
        component: "monitor/job/index",
        meta: {
          title: "定时任务",
          icon: "job",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Druid",
        path: "druid",
        hidden: false,
        component: "monitor/druid/index",
        meta: {
          title: "数据监控",
          icon: "druid",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Server",
        path: "server",
        hidden: false,
        component: "monitor/server/index",
        meta: {
          title: "服务监控",
          icon: "server",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Cache",
        path: "cache",
        hidden: false,
        component: "monitor/cache/index",
        meta: {
          title: "缓存监控",
          icon: "redis",
          noCache: false,
          link: null,
        },
      },
      {
        name: "CacheList",
        path: "cacheList",
        hidden: false,
        component: "monitor/cache/list",
        meta: {
          title: "缓存列表",
          icon: "redis-list",
          noCache: false,
          link: null,
        },
      },
    ],
  },
  {
    name: "Tool",
    path: "/tool",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "系统工具",
      icon: "tool",
      noCache: false,
      link: null,
    },
    children: [
      {
        name: "Build",
        path: "build",
        hidden: false,
        component: "tool/build/index",
        meta: {
          title: "表单构建",
          icon: "build",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Gen",
        path: "gen",
        hidden: false,
        component: "tool/gen/index",
        meta: {
          title: "代码生成",
          icon: "code",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Swagger",
        path: "swagger",
        hidden: false,
        component: "tool/swagger/index",
        meta: {
          title: "系统接口",
          icon: "swagger",
          noCache: false,
          link: null,
        },
      },
    ],
  },
  {
    name: "Http://ruoyi.vip",
    path: "http://ruoyi.vip",
    hidden: false,
    component: "Layout",
    meta: {
      title: "若依官网",
      icon: "guide",
      noCache: false,
      link: "http://ruoyi.vip",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
