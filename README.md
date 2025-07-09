# 登录流程测试系统

一个完整的用户认证系统演示，包含登录、注册、忘记密码、密码重置等功能。

## 🚀 功能特性

### 核心功能
- ✅ **用户登录** - 支持邮箱登录，记住我功能
- ✅ **用户注册** - 完整的注册流程，包含表单验证
- ✅ **忘记密码** - 邮箱找回密码功能
- ✅ **密码重置** - 安全的密码重置流程
- ✅ **表单验证** - 实时验证和错误提示
- ✅ **密码强度检测** - 可视化密码强度指示器

### 安全特性
- 🔒 **密码哈希** - 密码安全存储（演示用简单哈希）
- 🔒 **登录限制** - 防暴力破解，账户锁定机制
- 🔒 **令牌验证** - 密码重置令牌有效期控制
- 🔒 **输入验证** - 前端和后端双重验证
- 🔒 **XSS防护** - HTML转义处理

### 用户体验
- 📱 **响应式设计** - 支持手机、平板、桌面设备
- 🌙 **深色模式** - 自动适配系统主题
- ♿ **无障碍支持** - 高对比度模式，减少动画选项
- ⚡ **性能优化** - 防抖、节流、懒加载
- 🎨 **现代UI** - 渐变背景、动画效果、加载状态

## 📁 项目结构

```
├── index.html              # 主登录页面
├── pages/                  # 其他页面
│   ├── register.html       # 用户注册页面
│   ├── forgot-password.html # 忘记密码页面
│   └── reset-password.html # 密码重置页面
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   │   ├── style.css      # 主样式文件
│   │   └── responsive.css # 响应式样式
│   ├── js/                # JavaScript文件
│   │   ├── utils.js       # 工具函数
│   │   ├── validation.js  # 表单验证
│   │   └── auth.js        # 认证逻辑
│   └── images/            # 图片资源
├── docs/                  # 文档目录
├── README.md              # 项目说明
└── LICENSE               # 开源协议
```

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **存储**: localStorage (模拟后端数据库)
- **样式**: CSS Grid, Flexbox, CSS Variables
- **兼容性**: 现代浏览器 (Chrome 60+, Firefox 55+, Safari 12+)

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/Todyzhou/Test.git
cd Test
```

### 2. 本地运行
由于使用了ES6模块和localStorage，建议使用本地服务器运行：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用PHP
php -S localhost:8000
```

### 3. 访问应用
打开浏览器访问 `http://localhost:8000`

## 📖 使用说明

### 测试账户
系统预置了一个测试账户供快速体验：
- **邮箱**: test@example.com
- **密码**: Test123456

### 功能演示

#### 1. 用户登录
- 访问 `index.html`
- 输入邮箱和密码
- 支持"记住我"功能
- 登录失败5次后账户锁定15分钟

#### 2. 用户注册
- 点击"立即注册"链接
- 填写用户名、邮箱、密码等信息
- 实时验证用户名和邮箱唯一性
- 密码强度实时检测

#### 3. 忘记密码
- 点击"忘记密码？"链接
- 输入注册邮箱
- 系统模拟发送重置邮件
- 提供测试重置链接

#### 4. 密码重置
- 通过重置链接访问
- 输入新密码和确认密码
- 密码强度验证
- 重置成功后跳转登录

## 🔧 配置选项

### 安全配置
```javascript
// 在 auth.js 中可以修改以下配置
const maxAttempts = 5;           // 最大登录尝试次数
const lockoutDuration = 15 * 60 * 1000; // 锁定时间（毫秒）
const tokenExpiry = 30 * 60 * 1000;     // 重置令牌有效期
```

### 验证规则
```javascript
// 在 validation.js 中可以自定义验证规则
const validationRules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    phone: /^1[3-9]\d{9}$/
};
```

## 🎨 自定义样式

### CSS变量
系统使用CSS变量，便于主题定制：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### 响应式断点
```css
/* 平板 */
@media (max-width: 768px) { }

/* 手机 */
@media (max-width: 480px) { }

/* 超小屏幕 */
@media (max-width: 320px) { }
```

## 🔍 API文档

### 存储结构
```javascript
// localStorage 数据结构
{
    "auth_users": [
        {
            "id": "user_id",
            "username": "用户名",
            "email": "邮箱",
            "password": "哈希密码",
            "phone": "手机号",
            "createdAt": "创建时间",
            "isActive": true
        }
    ],
    "auth_current_user": {
        "id": "user_id",
        "username": "用户名",
        "email": "邮箱",
        "loginTime": "登录时间",
        "rememberMe": false
    },
    "auth_reset_tokens": {
        "token": {
            "email": "邮箱",
            "createdAt": "创建时间",
            "expiresAt": "过期时间",
            "used": false
        }
    }
}
```

### 主要函数
```javascript
// 用户认证
loginUser(email, password, rememberMe)
registerUser(userData)
resetPassword(token, newPassword)
sendPasswordResetEmail(email)

// 表单验证
validateEmail(email)
validatePassword(password)
validateUsername(username)
calculatePasswordStrength(password)

// 工具函数
showMessage(message, type, duration)
storage.set(key, value)
storage.get(key, defaultValue)
```

## 🚀 部署指南

### GitHub Pages
1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main）
4. 访问 `https://username.github.io/repository-name`

### Netlify
1. 连接GitHub仓库
2. 构建设置保持默认
3. 自动部署

### Vercel
1. 导入GitHub项目
2. 零配置部署
3. 自动HTTPS和CDN

## 🧪 测试

### 手动测试清单
- [ ] 登录功能（成功/失败）
- [ ] 注册功能（各种验证场景）
- [ ] 忘记密码流程
- [ ] 密码重置流程
- [ ] 响应式布局
- [ ] 表单验证
- [ ] 错误处理
- [ ] 安全特性

### 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ IE 11 (不支持)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2024-07-09)
- ✨ 初始版本发布
- ✨ 完整的登录注册流程
- ✨ 响应式设计
- ✨ 密码强度检测
- ✨ 安全特性实现

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙋‍♂️ 常见问题

### Q: 为什么使用localStorage而不是真实数据库？
A: 这是一个演示项目，使用localStorage可以在不需要后端服务器的情况下展示完整功能。

### Q: 密码哈希安全吗？
A: 当前使用的是简单的Base64编码，仅用于演示。生产环境应使用bcrypt等安全哈希算法。

### Q: 如何集成真实的邮件服务？
A: 需要后端支持，可以集成SendGrid、阿里云邮件推送等服务。

### Q: 支持第三方登录吗？
A: 当前版本不支持，但可以扩展集成OAuth 2.0服务。

## 📞 联系方式

- 项目地址: https://github.com/Todyzhou/Test
- 问题反馈: https://github.com/Todyzhou/Test/issues

---

⭐ 如果这个项目对您有帮助，请给个Star支持一下！

