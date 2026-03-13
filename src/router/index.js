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
    redirect: "/chongQing/relation",
    // children: [
    //   {
    //     path: "/index",
    //     component: () => import("@/views/index"),
    //     name: "Index",
    //     meta: { title: "首页", icon: "dashboard", affix: true },
    //   },
    // ],
  },
  // {
  //   path: "",
  //   component: Layout,
  //   redirect: "/index",
  //   children: [
  //     {
  //       path: "/index",
  //       component: () => import("@/views/index"),
  //       name: "Index",
  //       meta: { title: "首页", icon: "dashboard", affix: true },
  //     },
  //   ],
  // },
  // {
  //   path: "/user",
  //   component: Layout,
  //   hidden: true,
  //   redirect: "noredirect",
  //   children: [
  //     {
  //       path: "profile/:activeTab?",
  //       component: () => import("@/views/chongQing/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" },
  //     },
  //   ],
  // },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    name: "Chongqing",
    path: "/chongQing",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "重庆养心殿7大关系管理",
      icon: "management",
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
          icon: "relation",
          noCache: false,
          link: null,
        },
      },
      {
        name: "Phase",
        path: "phase",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "关系阶段管理",
          icon: "phase",
          noCache: false,
          link: null,
        },
        children: [
          {
            name: "PhaseBase",
            path: "base",
            hidden: false,
            component: "chongQing/phase/base/index",
            meta: {
              title: "关系阶段基础信息管理",
              icon: "base",
              noCache: false,
              link: null,
            },
          },
          {
            name: "PhaseStage",
            path: "stage",
            hidden: false,
            component: "chongQing/phase/stage/index",
            meta: {
              title: "关系阶段管理",
              icon: "period",
              noCache: false,
              link: null,
            },
          },
        ],
      },
      {
        name: "Toward",
        path: "toward",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "关系走向管理",
          icon: "toward",
          noCache: false,
          link: null,
        },
        children: [
          {
            name: "TowardBase",
            path: "base",
            hidden: false,
            component: "chongQing/toward/base/index",
            meta: {
              title: "关系走向基础信息管理",
              icon: "base",
              noCache: false,
              link: null,
            },
          },
          {
            name: "TowardStage",
            path: "stage",
            hidden: false,
            component: "chongQing/toward/stage/index",
            meta: {
              title: "关系走向管理",
              icon: "period",
              noCache: false,
              link: null,
            },
          },
        ],
      },
      {
        name: "Test",
        path: "test",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "测试题管理",
          icon: "test",
          noCache: false,
          link: null,
        },
        children: [
          {
            name: "TestList",
            path: "list",
            hidden: false,
            component: "chongQing/test/list/index",
            meta: {
              title: "测试题列表",
              icon: "list",
              noCache: false,
              link: null,
            },
          },
          {
            name: "TestRecord",
            path: "record",
            hidden: false,
            component: "chongQing/test/record/index",
            meta: {
              title: "测试记录",
              icon: "log",
              noCache: false,
              link: null,
            },
          },
        ],
      },
      {
        name: "System",
        path: "system",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "系统管理",
          icon: "system",
          noCache: false,
          link: null,
        },
        children: [
          {
            name: "SystemVersion",
            path: "version",
            hidden: false,
            component: "chongQing/system/version/index",
            meta: {
              title: "版本管理",
              icon: "version",
              noCache: false,
              link: null,
            },
          },
          {
            name: "SystemDevice",
            path: "device",
            hidden: false,
            component: "chongQing/system/device/index",
            meta: {
              title: "设备管理",
              icon: "device",
              noCache: false,
              link: null,
            },
          },
        ],
      },
    ],
  },
  // {
  //   name: "Http://ruoyi.vip",
  //   path: "http://ruoyi.vip",
  //   hidden: false,
  //   component: "Layout",
  //   meta: {
  //     title: "若依官网",
  //     icon: "guide",
  //     noCache: false,
  //     link: "http://ruoyi.vip",
  //   },
  // },
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
