import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [],   //扁平化处理的路由   同+异扁平
    addRoutes: [],  //异扁平
    defaultRoutes: [],  //默认路由  同+异
    topbarRouters: [],  //异
    sidebarRouters: [],   //侧边栏路由  同+异
  }), 
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateRoutes(roles) {
      return new Promise((resolve) => {
        let routeA=dynamicRoutes
        // 向后端请求路由数据
        // getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(routeA))
          const rdata = JSON.parse(JSON.stringify(routeA))
          const defaultData = JSON.parse(JSON.stringify(routeA))
          
          const sidebarRoutes = filterAsyncRouter(sdata)  // 侧边栏路由（保留 children）
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)  // 重写路由（扁平化 children）
          const defaultRoutes = filterAsyncRouter(defaultData)   // 默认路由
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)  // 过滤有权限的路由
          asyncRoutes.forEach(route => { router.addRoute(route) })  // 注册到 Vue Router
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))   // ✅ 设置侧边栏菜单
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        // })
        dynamicRoutes.forEach((route) => {
          router.addRoute(route);
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el) => {
    el.path = lastRouter ? lastRouter.path + "/" + el.path : el.path;
    if (el.children && el.children.length && el.component === "ParentView") {
      children = children.concat(filterChildren(el.children, el));
    } else {
      children.push(el);
    }
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
