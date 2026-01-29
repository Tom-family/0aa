import router from "@/router";
import { ElMessageBox } from "element-plus";
import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { isHttp, isEmpty } from "@/utils/validate";
import defAva from "@/assets/images/profile.jpg";

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    id: "",
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(userInfo) {
      const phone = userInfo.phone.trim();
      const password = userInfo.password;
      // const code = userInfo.code
      // const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(phone, password)
          .then((res) => {
            setToken(res.data);
            this.token = res.data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.data.worker;
            // if (!isHttp(avatar)) {
            //   avatar = isEmpty(avatar) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar;
            // }
            // if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
            //   this.roles = res.roles;
            //   this.permissions = res.permissions;
            // } else {
              this.roles = ["ROLE_DEFAULT"];
            // }
            this.id = user.workId;
            this.name = user.workName;
            this.avatar = user.avatar || "";
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  persist: {
    enabled: true, // 启用持久化
    strategies: [
      {
        key: "user", // 指定存储的 key
        storage: localStorage, // 使用 localStorage
        paths: ["token", "user"], // 只持久化 count 字段
      },
    ],
  },
});

export default useUserStore;
