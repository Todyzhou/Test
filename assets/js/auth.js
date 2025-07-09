/**
 * 用户认证逻辑
 * 处理登录、注册、密码重置等功能
 */

// 用户数据存储键名
const STORAGE_KEYS = {
    USERS: 'auth_users',
    CURRENT_USER: 'auth_current_user',
    RESET_TOKENS: 'auth_reset_tokens',
    LOGIN_ATTEMPTS: 'auth_login_attempts'
};

// 初始化默认用户（用于测试）
function initDefaultUsers() {
    const existingUsers = storage.get(STORAGE_KEYS.USERS, []);
    
    if (existingUsers.length === 0) {
        const defaultUsers = [
            {
                id: generateRandomString(16),
                username: 'testuser',
                email: 'test@example.com',
                password: hashPassword('Test123456'), // 测试密码
                phone: '13800138000',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        ];
        
        storage.set(STORAGE_KEYS.USERS, defaultUsers);
    }
}

// 简单的密码哈希（实际应用中应使用更安全的方法）
function hashPassword(password) {
    // 这里使用简单的Base64编码作为演示
    // 实际应用中应使用bcrypt等安全的哈希算法
    return btoa(password + 'salt_key_demo');
}

// 验证密码
function verifyPassword(password, hashedPassword) {
    return hashPassword(password) === hashedPassword;
}

// 获取用户登录尝试次数
function getLoginAttempts(email) {
    const attempts = storage.get(STORAGE_KEYS.LOGIN_ATTEMPTS, {});
    return attempts[email] || { count: 0, lastAttempt: null };
}

// 记录登录尝试
function recordLoginAttempt(email, success = false) {
    const attempts = storage.get(STORAGE_KEYS.LOGIN_ATTEMPTS, {});
    
    if (success) {
        delete attempts[email];
    } else {
        attempts[email] = {
            count: (attempts[email]?.count || 0) + 1,
            lastAttempt: new Date().toISOString()
        };
    }
    
    storage.set(STORAGE_KEYS.LOGIN_ATTEMPTS, attempts);
}

// 检查是否被锁定
function isAccountLocked(email) {
    const attempts = getLoginAttempts(email);
    const maxAttempts = 5;
    const lockoutDuration = 15 * 60 * 1000; // 15分钟
    
    if (attempts.count >= maxAttempts) {
        const lastAttempt = new Date(attempts.lastAttempt);
        const now = new Date();
        
        if (now - lastAttempt < lockoutDuration) {
            return {
                locked: true,
                remainingTime: Math.ceil((lockoutDuration - (now - lastAttempt)) / 1000 / 60)
            };
        } else {
            // 锁定时间已过，重置尝试次数
            recordLoginAttempt(email, true);
            return { locked: false };
        }
    }
    
    return { locked: false };
}

// 用户登录
async function loginUser(email, password, rememberMe = false) {
    try {
        // 检查账户是否被锁定
        const lockStatus = isAccountLocked(email);
        if (lockStatus.locked) {
            throw new Error(`账户已被锁定，请在${lockStatus.remainingTime}分钟后重试`);
        }
        
        // 模拟API延迟
        await delay(1000);
        
        const users = storage.get(STORAGE_KEYS.USERS, []);
        const user = users.find(u => u.email === email && u.isActive);
        
        if (!user) {
            recordLoginAttempt(email, false);
            throw new Error('邮箱地址不存在或账户已被禁用');
        }
        
        if (!verifyPassword(password, user.password)) {
            recordLoginAttempt(email, false);
            throw new Error('密码错误');
        }
        
        // 登录成功
        recordLoginAttempt(email, true);
        
        const currentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        storage.set(STORAGE_KEYS.CURRENT_USER, currentUser);
        
        return {
            success: true,
            user: currentUser,
            message: '登录成功'
        };
        
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 用户注册
async function registerUser(userData) {
    try {
        // 模拟API延迟
        await delay(1500);
        
        const users = storage.get(STORAGE_KEYS.USERS, []);
        
        // 检查邮箱是否已存在
        if (users.some(u => u.email === userData.email)) {
            throw new Error('该邮箱已被注册');
        }
        
        // 检查用户名是否已存在
        if (users.some(u => u.username === userData.username)) {
            throw new Error('该用户名已被使用');
        }
        
        // 创建新用户
        const newUser = {
            id: generateRandomString(16),
            username: userData.username,
            email: userData.email,
            password: hashPassword(userData.password),
            phone: userData.phone || '',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        users.push(newUser);
        storage.set(STORAGE_KEYS.USERS, users);
        
        return {
            success: true,
            message: '注册成功，请登录'
        };
        
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 发送密码重置邮件
async function sendPasswordResetEmail(email) {
    try {
        // 模拟API延迟
        await delay(1200);
        
        const users = storage.get(STORAGE_KEYS.USERS, []);
        const user = users.find(u => u.email === email && u.isActive);
        
        if (!user) {
            // 为了安全，即使用户不存在也显示成功消息
            return {
                success: true,
                message: '如果该邮箱已注册，您将收到密码重置邮件'
            };
        }
        
        // 生成重置令牌
        const resetToken = generateRandomString(32);
        const resetTokens = storage.get(STORAGE_KEYS.RESET_TOKENS, {});
        
        resetTokens[resetToken] = {
            email: email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟过期
            used: false
        };
        
        storage.set(STORAGE_KEYS.RESET_TOKENS, resetTokens);
        
        return {
            success: true,
            message: '密码重置邮件已发送',
            resetToken: resetToken // 在实际应用中不应返回token
        };
        
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 验证重置令牌
function validateResetToken(token) {
    const resetTokens = storage.get(STORAGE_KEYS.RESET_TOKENS, {});
    const tokenData = resetTokens[token];
    
    if (!tokenData) {
        return { valid: false, message: '无效的重置链接' };
    }
    
    if (tokenData.used) {
        return { valid: false, message: '该重置链接已被使用' };
    }
    
    const now = new Date();
    const expiresAt = new Date(tokenData.expiresAt);
    
    if (now > expiresAt) {
        return { valid: false, message: '重置链接已过期' };
    }
    
    return { valid: true, email: tokenData.email };
}

// 重置密码
async function resetPassword(token, newPassword) {
    try {
        // 验证令牌
        const tokenValidation = validateResetToken(token);
        if (!tokenValidation.valid) {
            throw new Error(tokenValidation.message);
        }
        
        // 模拟API延迟
        await delay(1000);
        
        const users = storage.get(STORAGE_KEYS.USERS, []);
        const userIndex = users.findIndex(u => u.email === tokenValidation.email);
        
        if (userIndex === -1) {
            throw new Error('用户不存在');
        }
        
        // 更新密码
        users[userIndex].password = hashPassword(newPassword);
        storage.set(STORAGE_KEYS.USERS, users);
        
        // 标记令牌为已使用
        const resetTokens = storage.get(STORAGE_KEYS.RESET_TOKENS, {});
        resetTokens[token].used = true;
        storage.set(STORAGE_KEYS.RESET_TOKENS, resetTokens);
        
        // 清除登录尝试记录
        recordLoginAttempt(tokenValidation.email, true);
        
        return {
            success: true,
            message: '密码重置成功'
        };
        
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 获取当前用户
function getCurrentUser() {
    return storage.get(STORAGE_KEYS.CURRENT_USER, null);
}

// 用户登出
function logoutUser() {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    return { success: true, message: '已退出登录' };
}

// 检查用户是否已登录
function isUserLoggedIn() {
    const currentUser = getCurrentUser();
    return currentUser !== null;
}

// 初始化登录页面
function initLoginPage() {
    initDefaultUsers();
    
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    // 设置字段验证
    setupFieldValidation('email', validateEmail);
    setupFieldValidation('password', (password) => {
        if (!password) return { valid: false, message: '密码不能为空' };
        return { valid: true, message: '' };
    });
    
    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = serializeForm(this);
        const { email, password, rememberMe } = formData;
        
        // 基础验证
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            showFieldError('email', emailValidation.message);
            return;
        }
        
        if (!password) {
            showFieldError('password', '密码不能为空');
            return;
        }
        
        clearAllErrors();
        setButtonLoading(null, true);
        
        try {
            const result = await loginUser(email, password, !!rememberMe);
            
            if (result.success) {
                showMessage('登录成功，正在跳转...', 'success');
                
                // 模拟跳转到主页
                setTimeout(() => {
                    showMessage('欢迎回来，' + result.user.username + '！', 'success');
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('登录失败，请稍后重试', 'error');
        } finally {
            setButtonLoading(null, false);
        }
    });
}

// 初始化注册页面
function initRegisterPage() {
    initDefaultUsers();
    
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    // 设置字段验证
    setupFieldValidation('username', validateUsername);
    setupFieldValidation('email', validateEmail);
    setupFieldValidation('password', validatePassword);
    setupFieldValidation('phone', validatePhone);
    
    // 设置密码确认验证
    setupPasswordConfirmValidation('password', 'confirmPassword');
    
    // 设置异步验证
    setupAsyncValidation('username', validateUsernameUnique);
    setupAsyncValidation('email', validateEmailUnique);
    
    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = serializeForm(this);
        const { username, email, password, confirmPassword, phone, agreeTerms } = formData;
        
        // 验证必填字段
        const validationConfig = {
            username: validateUsername,
            email: validateEmail,
            password: validatePassword,
            confirmPassword: (value) => validatePasswordConfirm(password, value)
        };
        
        if (!validateForm('registerForm', validationConfig)) {
            return;
        }
        
        // 验证手机号
        if (phone) {
            const phoneValidation = validatePhone(phone);
            if (!phoneValidation.valid) {
                showFieldError('phone', phoneValidation.message);
                return;
            }
        }
        
        // 检查是否同意条款
        if (!agreeTerms) {
            showMessage('请阅读并同意用户协议和隐私政策', 'error');
            return;
        }
        
        clearAllErrors();
        setButtonLoading(null, true);
        
        try {
            const result = await registerUser({ username, email, password, phone });
            
            if (result.success) {
                showMessage('注册成功！正在跳转到登录页面...', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('注册失败，请稍后重试', 'error');
        } finally {
            setButtonLoading(null, false);
        }
    });
}

// 初始化忘记密码页面
function initForgotPasswordPage() {
    initDefaultUsers();
    
    const form = document.getElementById('forgotPasswordForm');
    const successContent = document.getElementById('successContent');
    const testResetLink = document.getElementById('testResetLink');
    const resendBtn = document.getElementById('resendBtn');
    
    if (!form) return;
    
    // 设置字段验证
    setupFieldValidation('email', validateEmail);
    
    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = serializeForm(this);
        const { email } = formData;
        
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            showFieldError('email', emailValidation.message);
            return;
        }
        
        clearAllErrors();
        setButtonLoading(null, true);
        
        try {
            const result = await sendPasswordResetEmail(email);
            
            if (result.success) {
                // 隐藏表单，显示成功内容
                form.style.display = 'none';
                successContent.style.display = 'block';
                
                // 更新测试链接
                if (testResetLink && result.resetToken) {
                    testResetLink.href = `reset-password.html?token=${result.resetToken}&email=${encodeURIComponent(email)}`;
                }
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('发送失败，请稍后重试', 'error');
        } finally {
            setButtonLoading(null, false);
        }
    });
    
    // 重新发送按钮
    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            successContent.style.display = 'none';
            form.style.display = 'block';
            form.reset();
            clearAllErrors();
        });
    }
}

// 初始化密码重置页面
function initResetPasswordPage() {
    initDefaultUsers();
    
    const form = document.getElementById('resetPasswordForm');
    const invalidToken = document.getElementById('invalidToken');
    const successContent = document.getElementById('successContent');
    const emailField = document.getElementById('email');
    
    if (!form) return;
    
    // 获取URL参数
    const token = getUrlParameter('token');
    const email = getUrlParameter('email');
    
    // 验证令牌
    if (!token) {
        form.style.display = 'none';
        invalidToken.style.display = 'block';
        return;
    }
    
    const tokenValidation = validateResetToken(token);
    if (!tokenValidation.valid) {
        form.style.display = 'none';
        invalidToken.style.display = 'block';
        return;
    }
    
    // 设置邮箱字段
    if (emailField) {
        emailField.value = tokenValidation.email;
    }
    
    // 设置字段验证
    setupFieldValidation('newPassword', validatePassword);
    setupPasswordConfirmValidation('newPassword', 'confirmPassword');
    
    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = serializeForm(this);
        const { newPassword, confirmPassword } = formData;
        
        // 验证密码
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            showFieldError('newPassword', passwordValidation.message);
            return;
        }
        
        const confirmValidation = validatePasswordConfirm(newPassword, confirmPassword);
        if (!confirmValidation.valid) {
            showFieldError('confirmPassword', confirmValidation.message);
            return;
        }
        
        clearAllErrors();
        setButtonLoading(null, true);
        
        try {
            const result = await resetPassword(token, newPassword);
            
            if (result.success) {
                form.style.display = 'none';
                successContent.style.display = 'block';
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('重置失败，请稍后重试', 'error');
        } finally {
            setButtonLoading(null, false);
        }
    });
}

