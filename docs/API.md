# API 文档

本文档描述了登录流程测试系统的前端API接口和数据结构。

## 📋 目录

- [数据存储](#数据存储)
- [认证API](#认证api)
- [验证API](#验证api)
- [工具API](#工具api)
- [错误处理](#错误处理)
- [数据模型](#数据模型)

## 🗄️ 数据存储

系统使用localStorage模拟后端数据库，包含以下存储键：

### 存储键常量
```javascript
const STORAGE_KEYS = {
    USERS: 'auth_users',              // 用户数据
    CURRENT_USER: 'auth_current_user', // 当前登录用户
    RESET_TOKENS: 'auth_reset_tokens', // 密码重置令牌
    LOGIN_ATTEMPTS: 'auth_login_attempts' // 登录尝试记录
};
```

## 🔐 认证API

### loginUser(email, password, rememberMe)
用户登录

**参数:**
- `email` (string): 用户邮箱
- `password` (string): 用户密码
- `rememberMe` (boolean): 是否记住登录状态

**返回值:**
```javascript
{
    success: boolean,
    user?: {
        id: string,
        username: string,
        email: string,
        phone: string,
        loginTime: string,
        rememberMe: boolean
    },
    message: string
}
```

**示例:**
```javascript
const result = await loginUser('test@example.com', 'Test123456', true);
if (result.success) {
    console.log('登录成功:', result.user);
} else {
    console.error('登录失败:', result.message);
}
```

### registerUser(userData)
用户注册

**参数:**
```javascript
userData = {
    username: string,    // 用户名 (3-20字符)
    email: string,       // 邮箱地址
    password: string,    // 密码 (至少8位，包含字母和数字)
    phone?: string       // 手机号 (可选)
}
```

**返回值:**
```javascript
{
    success: boolean,
    message: string
}
```

**示例:**
```javascript
const userData = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'NewPass123',
    phone: '13800138001'
};

const result = await registerUser(userData);
if (result.success) {
    console.log('注册成功');
} else {
    console.error('注册失败:', result.message);
}
```

### sendPasswordResetEmail(email)
发送密码重置邮件

**参数:**
- `email` (string): 用户邮箱

**返回值:**
```javascript
{
    success: boolean,
    message: string,
    resetToken?: string  // 仅在测试模式下返回
}
```

**示例:**
```javascript
const result = await sendPasswordResetEmail('user@example.com');
if (result.success) {
    console.log('重置邮件已发送');
}
```

### resetPassword(token, newPassword)
重置密码

**参数:**
- `token` (string): 重置令牌
- `newPassword` (string): 新密码

**返回值:**
```javascript
{
    success: boolean,
    message: string
}
```

**示例:**
```javascript
const result = await resetPassword('reset-token-123', 'NewPassword123');
if (result.success) {
    console.log('密码重置成功');
}
```

### getCurrentUser()
获取当前登录用户

**返回值:**
```javascript
{
    id: string,
    username: string,
    email: string,
    phone: string,
    loginTime: string,
    rememberMe: boolean
} | null
```

### logoutUser()
用户登出

**返回值:**
```javascript
{
    success: boolean,
    message: string
}
```

### isUserLoggedIn()
检查用户是否已登录

**返回值:** `boolean`

## ✅ 验证API

### validateEmail(email)
验证邮箱格式

**参数:**
- `email` (string): 邮箱地址

**返回值:**
```javascript
{
    valid: boolean,
    message: string
}
```

### validateUsername(username)
验证用户名

**参数:**
- `username` (string): 用户名

**返回值:**
```javascript
{
    valid: boolean,
    message: string
}
```

**验证规则:**
- 长度: 3-20字符
- 字符: 字母、数字、下划线
- 正则: `/^[a-zA-Z0-9_]{3,20}$/`

### validatePassword(password)
验证密码强度

**参数:**
- `password` (string): 密码

**返回值:**
```javascript
{
    valid: boolean,
    message: string
}
```

**验证规则:**
- 最小长度: 8字符
- 最大长度: 128字符
- 必须包含: 至少一个字母和一个数字
- 正则: `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/`

### validatePasswordConfirm(password, confirmPassword)
验证密码确认

**参数:**
- `password` (string): 原密码
- `confirmPassword` (string): 确认密码

**返回值:**
```javascript
{
    valid: boolean,
    message: string
}
```

### validatePhone(phone)
验证手机号

**参数:**
- `phone` (string): 手机号

**返回值:**
```javascript
{
    valid: boolean,
    message: string
}
```

**验证规则:**
- 格式: 中国大陆手机号
- 正则: `/^1[3-9]\d{9}$/`
- 可选字段: 空值时返回valid: true

### calculatePasswordStrength(password)
计算密码强度

**参数:**
- `password` (string): 密码

**返回值:**
```javascript
{
    score: number,      // 强度分数 (0-8)
    text: string,       // 强度描述 ('弱'/'中等'/'强')
    level: string,      // 强度等级 ('weak'/'medium'/'strong')
    feedback: string[]  // 改进建议
}
```

**强度评分标准:**
- 长度 ≥ 8字符: +1分
- 长度 ≥ 12字符: +1分
- 包含小写字母: +1分
- 包含大写字母: +1分
- 包含数字: +1分
- 包含特殊字符: +1分
- 避免重复字符: +1分
- 避免常见序列: +1分

### 异步验证

#### validateEmailUnique(email, excludeEmail?)
验证邮箱唯一性

**参数:**
- `email` (string): 邮箱地址
- `excludeEmail` (string, 可选): 排除的邮箱（用于更新场景）

**返回值:** `Promise<{valid: boolean, message: string}>`

#### validateUsernameUnique(username)
验证用户名唯一性

**参数:**
- `username` (string): 用户名

**返回值:** `Promise<{valid: boolean, message: string}>`

## 🛠️ 工具API

### 消息显示

#### showMessage(message, type, duration)
显示消息提示

**参数:**
- `message` (string): 消息内容
- `type` (string): 消息类型 ('success'/'error'/'info')
- `duration` (number): 显示时长（毫秒，默认5000）

#### hideMessage()
隐藏消息提示

### 字段错误处理

#### showFieldError(fieldId, message)
显示字段错误

**参数:**
- `fieldId` (string): 字段ID
- `message` (string): 错误消息

#### clearFieldError(fieldId)
清除字段错误

**参数:**
- `fieldId` (string): 字段ID

#### clearAllErrors()
清除所有错误提示

### 按钮状态

#### setButtonLoading(buttonId, loading)
设置按钮加载状态

**参数:**
- `buttonId` (string): 按钮ID（可选，默认查找submit按钮）
- `loading` (boolean): 是否加载中

### 存储操作

#### storage.set(key, value)
存储数据

**参数:**
- `key` (string): 存储键
- `value` (any): 存储值

**返回值:** `boolean` - 是否成功

#### storage.get(key, defaultValue)
获取数据

**参数:**
- `key` (string): 存储键
- `defaultValue` (any): 默认值

**返回值:** `any` - 存储的值或默认值

#### storage.remove(key)
删除数据

**参数:**
- `key` (string): 存储键

**返回值:** `boolean` - 是否成功

#### storage.clear()
清空所有数据

**返回值:** `boolean` - 是否成功

### 实用工具

#### getUrlParameter(name)
获取URL参数

**参数:**
- `name` (string): 参数名

**返回值:** `string | null`

#### generateRandomString(length)
生成随机字符串

**参数:**
- `length` (number): 字符串长度（默认32）

**返回值:** `string`

#### formatDate(date)
格式化日期

**参数:**
- `date` (Date | string): 日期对象或字符串

**返回值:** `string` - 格式化后的日期 (YYYY-MM-DD HH:mm)

#### delay(ms)
延迟函数

**参数:**
- `ms` (number): 延迟毫秒数

**返回值:** `Promise<void>`

#### debounce(func, wait)
防抖函数

**参数:**
- `func` (Function): 要防抖的函数
- `wait` (number): 等待时间（毫秒）

**返回值:** `Function` - 防抖后的函数

#### throttle(func, limit)
节流函数

**参数:**
- `func` (Function): 要节流的函数
- `limit` (number): 限制时间（毫秒）

**返回值:** `Function` - 节流后的函数

## ❌ 错误处理

### 错误类型

#### 验证错误
- 邮箱格式错误
- 密码强度不足
- 用户名不符合规范
- 必填字段为空

#### 认证错误
- 用户不存在
- 密码错误
- 账户被锁定
- 令牌无效或过期

#### 系统错误
- 网络请求失败
- 存储操作失败
- 未知错误

### 错误处理模式

```javascript
try {
    const result = await someAsyncFunction();
    if (result.success) {
        // 处理成功情况
        showMessage(result.message, 'success');
    } else {
        // 处理业务错误
        showMessage(result.message, 'error');
    }
} catch (error) {
    // 处理系统错误
    console.error('系统错误:', error);
    showMessage('操作失败，请稍后重试', 'error');
}
```

## 📊 数据模型

### User (用户)
```javascript
{
    id: string,           // 用户ID (随机生成)
    username: string,     // 用户名 (3-20字符)
    email: string,        // 邮箱地址 (唯一)
    password: string,     // 哈希密码
    phone: string,        // 手机号 (可选)
    createdAt: string,    // 创建时间 (ISO字符串)
    isActive: boolean     // 账户状态
}
```

### CurrentUser (当前用户)
```javascript
{
    id: string,           // 用户ID
    username: string,     // 用户名
    email: string,        // 邮箱地址
    phone: string,        // 手机号
    loginTime: string,    // 登录时间 (ISO字符串)
    rememberMe: boolean   // 是否记住登录
}
```

### ResetToken (重置令牌)
```javascript
{
    email: string,        // 关联邮箱
    createdAt: string,    // 创建时间 (ISO字符串)
    expiresAt: string,    // 过期时间 (ISO字符串)
    used: boolean         // 是否已使用
}
```

### LoginAttempt (登录尝试)
```javascript
{
    count: number,        // 尝试次数
    lastAttempt: string   // 最后尝试时间 (ISO字符串)
}
```

## 🔧 配置选项

### 安全配置
```javascript
// 在 auth.js 中可修改
const maxAttempts = 5;                    // 最大登录尝试次数
const lockoutDuration = 15 * 60 * 1000;  // 锁定时长 (15分钟)
const tokenExpiry = 30 * 60 * 1000;      // 令牌有效期 (30分钟)
```

### 验证配置
```javascript
// 在 validation.js 中可修改
const validationRules = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址'
    },
    username: {
        pattern: /^[a-zA-Z0-9_]{3,20}$/,
        message: '用户名必须是3-20位字母、数字或下划线'
    },
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        message: '密码至少8位，必须包含字母和数字'
    },
    phone: {
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入有效的手机号码'
    }
};
```

## 📝 使用示例

### 完整登录流程
```javascript
// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
});

// 处理登录表单
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = serializeForm(this);
    const { email, password, rememberMe } = formData;
    
    // 验证输入
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showFieldError('email', emailValidation.message);
        return;
    }
    
    // 执行登录
    setButtonLoading(null, true);
    try {
        const result = await loginUser(email, password, !!rememberMe);
        if (result.success) {
            showMessage('登录成功', 'success');
            // 跳转到主页或执行其他操作
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('登录失败，请稍后重试', 'error');
    } finally {
        setButtonLoading(null, false);
    }
});
```

### 实时表单验证
```javascript
// 设置字段验证
setupFieldValidation('email', validateEmail);
setupFieldValidation('password', validatePassword);

// 设置异步验证
setupAsyncValidation('email', validateEmailUnique, 1000);
setupAsyncValidation('username', validateUsernameUnique, 1000);

// 设置密码确认验证
setupPasswordConfirmValidation('password', 'confirmPassword');
```

---

📚 更多信息请参考 [README.md](../README.md) 文件。

