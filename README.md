# 后台api接口

主要提供的接口为登陆、注册、个人求职信息完善、联系人列表展示、未读消息提示、聊天表情、用户中心等。

权限验证是前端通过后端返回的字段进行验证，来区别用户的身份

实现登录状态存储和socket.io双向通信等

__注：此项目纯属个人瞎搞，不用于任何商业用途。__


## 技术栈

nodejs + express + mongodb + mongoose + es6/7 


## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node (6.0 及以上版本)
2、mongodb (开启状态)
```

```

npm install

npm start


```