/**
 * 表单验证函数库
 * 提供各种输入验证功能
 */

// 验证规则
const validationRules = {
    // 邮箱验证
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址'
    },
    
    // 用户名验证（3-20位，字母数字下划线）
    username: {
        pattern: /^[a-zA-Z0-9_]{3,20}$/,
        message: '用户名必须是3-20位字母、数字或下划线'
    },
    
    // 密码验证（至少8位，包含字母和数字）
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        message: '密码至少8位，必须包含字母和数字'
    },
    
    // 手机号验证（中国大陆）
    phone: {
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入有效的手机号码'
    }
};

// 验证邮箱
function validateEmail(email) {
    if (!email) {
        return { valid: false, message: '邮箱地址不能为空' };
    }
    
    if (!validationRules.email.pattern.test(email)) {
        return { valid: false, message: validationRules.email.message };
    }
    
    return { valid: true, message: '' };
}

// 验证用户名
function validateUsername(username) {
    if (!username) {
        return { valid: false, message: '用户名不能为空' };
    }
    
    if (username.length < 3) {
        return { valid: false, message: '用户名至少需要3个字符' };
    }
    
    if (username.length > 20) {
        return { valid: false, message: '用户名不能超过20个字符' };
    }
    
    if (!validationRules.username.pattern.test(username)) {
        return { valid: false, message: validationRules.username.message };
    }
    
    return { valid: true, message: '' };
}

// 验证密码
function validatePassword(password) {
    if (!password) {
        return { valid: false, message: '密码不能为空' };
    }
    
    if (password.length < 8) {
        return { valid: false, message: '密码至少需要8个字符' };
    }
    
    if (password.length > 128) {
        return { valid: false, message: '密码不能超过128个字符' };
    }
    
    if (!/[A-Za-z]/.test(password)) {
        return { valid: false, message: '密码必须包含至少一个字母' };
    }
    
    if (!/\d/.test(password)) {
        return { valid: false, message: '密码必须包含至少一个数字' };
    }
    
    return { valid: true, message: '' };
}

// 验证密码确认
function validatePasswordConfirm(password, confirmPassword) {
    if (!confirmPassword) {
        return { valid: false, message: '请确认密码' };
    }
    
    if (password !== confirmPassword) {
        return { valid: false, message: '两次输入的密码不一致' };
    }
    
    return { valid: true, message: '' };
}

// 验证手机号
function validatePhone(phone) {
    if (!phone) {
        return { valid: true, message: '' }; // 手机号是可选的
    }
    
    if (!validationRules.phone.pattern.test(phone)) {
        return { valid: false, message: validationRules.phone.message };
    }
    
    return { valid: true, message: '' };
}

// 计算密码强度
function calculatePasswordStrength(password) {
    if (!password) {
        return { score: 0, text: '请输入密码', level: '' };
    }
    
    let score = 0;
    let feedback = [];
    
    // 长度检查
    if (password.length >= 8) score += 1;
    else feedback.push('至少8个字符');
    
    if (password.length >= 12) score += 1;
    
    // 字符类型检查
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('包含小写字母');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('包含大写字母');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('包含数字');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('包含特殊字符');
    
    // 避免常见模式
    if (!/(.)\1{2,}/.test(password)) score += 1; // 避免连续重复字符
    if (!/123|abc|qwe/i.test(password)) score += 1; // 避免常见序列
    
    // 确定强度等级
    let level, text;
    if (score <= 2) {
        level = 'weak';
        text = '弱';
    } else if (score <= 4) {
        level = 'medium';
        text = '中等';
    } else {
        level = 'strong';
        text = '强';
    }
    
    return { score, text, level, feedback };
}

// 更新密码强度显示
function updatePasswordStrength(password, containerId = 'password') {
    const strength = calculatePasswordStrength(password);
    const container = document.querySelector(`#${containerId} + .password-strength`) || 
                     document.querySelector('.password-strength');
    
    if (!container) return;
    
    const strengthBar = container.querySelector('.strength-bar');
    const strengthFill = container.querySelector('.strength-fill');
    const strengthText = container.querySelector('#strengthText');
    
    if (strengthBar) {
        strengthBar.className = `strength-bar strength-${strength.level}`;
    }
    
    if (strengthFill) {
        strengthFill.className = `strength-fill`;
        strengthFill.parentElement.className = `strength-bar strength-${strength.level}`;
    }
    
    if (strengthText) {
        strengthText.textContent = strength.text;
    }
}

// 实时验证字段
function setupFieldValidation(fieldId, validationFunction) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // 失去焦点时验证
    field.addEventListener('blur', function() {
        const result = validationFunction(this.value);
        if (!result.valid) {
            showFieldError(fieldId, result.message);
        } else {
            clearFieldError(fieldId);
        }
    });
    
    // 输入时清除错误
    field.addEventListener('input', function() {
        clearFieldError(fieldId);
        
        // 特殊处理密码强度
        if (fieldId === 'password' || fieldId === 'newPassword') {
            updatePasswordStrength(this.value, fieldId);
        }
    });
}

// 设置密码确认验证
function setupPasswordConfirmValidation(passwordId, confirmId) {
    const passwordField = document.getElementById(passwordId);
    const confirmField = document.getElementById(confirmId);
    
    if (!passwordField || !confirmField) return;
    
    function validateConfirm() {
        const result = validatePasswordConfirm(passwordField.value, confirmField.value);
        if (!result.valid) {
            showFieldError(confirmId, result.message);
        } else {
            clearFieldError(confirmId);
        }
    }
    
    confirmField.addEventListener('blur', validateConfirm);
    confirmField.addEventListener('input', function() {
        clearFieldError(confirmId);
    });
    
    passwordField.addEventListener('input', function() {
        if (confirmField.value) {
            validateConfirm();
        }
    });
}

// 验证整个表单
function validateForm(formId, validationConfig) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    clearAllErrors();
    
    // 遍历验证配置
    for (const [fieldId, validator] of Object.entries(validationConfig)) {
        const field = document.getElementById(fieldId);
        if (!field) continue;
        
        const result = validator(field.value);
        if (!result.valid) {
            showFieldError(fieldId, result.message);
            isValid = false;
        }
    }
    
    return isValid;
}

// 检查邮箱是否已存在（模拟）
async function checkEmailExists(email) {
    // 模拟API调用
    await delay(500);
    
    const existingUsers = storage.get('users', []);
    return existingUsers.some(user => user.email === email);
}

// 检查用户名是否已存在（模拟）
async function checkUsernameExists(username) {
    // 模拟API调用
    await delay(500);
    
    const existingUsers = storage.get('users', []);
    return existingUsers.some(user => user.username === username);
}

// 异步验证邮箱唯一性
async function validateEmailUnique(email, excludeEmail = null) {
    const basicValidation = validateEmail(email);
    if (!basicValidation.valid) {
        return basicValidation;
    }
    
    if (email === excludeEmail) {
        return { valid: true, message: '' };
    }
    
    const exists = await checkEmailExists(email);
    if (exists) {
        return { valid: false, message: '该邮箱已被注册' };
    }
    
    return { valid: true, message: '' };
}

// 异步验证用户名唯一性
async function validateUsernameUnique(username) {
    const basicValidation = validateUsername(username);
    if (!basicValidation.valid) {
        return basicValidation;
    }
    
    const exists = await checkUsernameExists(username);
    if (exists) {
        return { valid: false, message: '该用户名已被使用' };
    }
    
    return { valid: true, message: '' };
}

// 设置异步验证
function setupAsyncValidation(fieldId, asyncValidator, delay_ms = 1000) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    let validationTimeout;
    
    field.addEventListener('input', debounce(async function() {
        const value = this.value.trim();
        if (!value) return;
        
        try {
            // 显示验证中状态
            const errorEl = document.getElementById(fieldId + 'Error');
            if (errorEl) {
                errorEl.textContent = '验证中...';
                errorEl.style.color = '#666';
            }
            
            const result = await asyncValidator(value);
            
            // 恢复错误样式
            if (errorEl) {
                errorEl.style.color = '';
            }
            
            if (!result.valid) {
                showFieldError(fieldId, result.message);
            } else {
                clearFieldError(fieldId);
            }
        } catch (error) {
            console.error('异步验证失败:', error);
            showFieldError(fieldId, '验证失败，请稍后重试');
        }
    }, delay_ms));
}

