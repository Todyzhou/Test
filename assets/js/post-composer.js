// 动态发布器功能
class PostComposer {
    constructor() {
        this.maxLength = 280;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCharCount();
    }

    bindEvents() {
        const postContent = document.getElementById('postContent');
        const publishBtn = document.getElementById('publishBtn');
        const composeBtn = document.getElementById('composeBtn');

        if (postContent) {
            postContent.addEventListener('input', () => {
                this.updateCharCount();
                this.updatePublishButton();
            });

            postContent.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.publishPost();
                }
            });
        }

        if (publishBtn) {
            publishBtn.addEventListener('click', () => {
                this.publishPost();
            });
        }

        if (composeBtn) {
            composeBtn.addEventListener('click', () => {
                this.focusComposer();
            });
        }

        // 工具按钮事件
        this.bindToolEvents();
    }

    bindToolEvents() {
        const toolButtons = document.querySelectorAll('.tool-btn');
        
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('fa-image')) {
                    this.handleImageUpload();
                } else if (icon.classList.contains('fa-hashtag')) {
                    this.insertHashtag();
                } else if (icon.classList.contains('fa-at')) {
                    this.insertMention();
                } else if (icon.classList.contains('fa-map-marker-alt')) {
                    this.insertLocation();
                }
            });
        });
    }

    updateCharCount() {
        const postContent = document.getElementById('postContent');
        const charCount = document.querySelector('.char-count');
        
        if (postContent && charCount) {
            const currentLength = postContent.value.length;
            charCount.textContent = `${currentLength}/${this.maxLength}`;
            
            // 更新字符计数颜色
            charCount.classList.remove('warning', 'danger');
            if (currentLength > this.maxLength * 0.8) {
                charCount.classList.add('warning');
            }
            if (currentLength > this.maxLength) {
                charCount.classList.add('danger');
            }
        }
    }

    updatePublishButton() {
        const postContent = document.getElementById('postContent');
        const publishBtn = document.getElementById('publishBtn');
        
        if (postContent && publishBtn) {
            const content = postContent.value.trim();
            const isValid = content.length > 0 && content.length <= this.maxLength;
            
            publishBtn.disabled = !isValid;
            publishBtn.textContent = content.length > this.maxLength ? '超出限制' : '发布';
        }
    }

    async publishPost() {
        const postContent = document.getElementById('postContent');
        const publishBtn = document.getElementById('publishBtn');
        
        if (!postContent || !publishBtn || publishBtn.disabled) {
            return;
        }

        const content = postContent.value.trim();
        if (!content) {
            return;
        }

        // 显示发布中状态
        publishBtn.disabled = true;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发布中...';

        try {
            // 模拟API调用
            await this.simulatePostCreation(content);
            
            // 创建新的动态卡片
            this.createPostCard(content);
            
            // 清空输入框
            postContent.value = '';
            this.updateCharCount();
            this.updatePublishButton();
            
            // 显示成功提示
            this.showNotification('动态发布成功！', 'success');
            
        } catch (error) {
            console.error('发布失败:', error);
            this.showNotification('发布失败，请重试', 'error');
        } finally {
            publishBtn.disabled = false;
            publishBtn.textContent = '发布';
        }
    }

    async simulatePostCreation(content) {
        // 模拟网络延迟
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    createPostCard(content) {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const postCard = document.createElement('div');
        postCard.className = 'post-card fade-in';
        
        const processedContent = this.processContent(content);
        const currentTime = new Date().toLocaleString('zh-CN');
        
        postCard.innerHTML = `
            <div class="post-header">
                <img src="https://via.placeholder.com/40x40/4a5568/ffffff?text=U" alt="用户头像" class="avatar avatar-lg">
                <div class="post-user-info">
                    <div class="post-username">当前用户</div>
                    <div class="post-handle">@current_user</div>
                </div>
                <div class="post-time">${currentTime}</div>
            </div>
            <div class="post-content">${processedContent}</div>
            <div class="post-actions">
                <button class="action-btn" data-action="reply">
                    <i class="fas fa-reply"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" data-action="retweet">
                    <i class="fas fa-retweet"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" data-action="like">
                    <i class="fas fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" data-action="share">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        `;

        // 添加到时间线顶部
        timeline.insertBefore(postCard, timeline.firstChild);
        
        // 绑定动作按钮事件
        this.bindPostActions(postCard);
    }

    processContent(content) {
        // 处理话题标签
        content = content.replace(/#([^\s#]+)/g, '<a href="pages/topic.html?topic=$1" class="hashtag">#$1</a>');
        
        // 处理@提及
        content = content.replace(/@([^\s@]+)/g, '<a href="pages/profile.html?user=$1" class="mention">@$1</a>');
        
        // 处理换行
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }

    bindPostActions(postCard) {
        const actionBtns = postCard.querySelectorAll('.action-btn');
        
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                
                switch (action) {
                    case 'reply':
                        this.handleReply(btn);
                        break;
                    case 'retweet':
                        this.handleRetweet(btn);
                        break;
                    case 'like':
                        this.handleLike(btn);
                        break;
                    case 'share':
                        this.handleShare(btn);
                        break;
                }
            });
        });
    }

    handleReply(btn) {
        // 实现回复功能
        this.focusComposer();
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.focus();
        }
    }

    handleRetweet(btn) {
        const span = btn.querySelector('span');
        const currentCount = parseInt(span.textContent);
        
        if (btn.classList.contains('retweeted')) {
            btn.classList.remove('retweeted');
            span.textContent = currentCount - 1;
            this.showNotification('已取消转发', 'info');
        } else {
            btn.classList.add('retweeted');
            span.textContent = currentCount + 1;
            this.showNotification('转发成功', 'success');
        }
    }

    handleLike(btn) {
        const span = btn.querySelector('span');
        const currentCount = parseInt(span.textContent);
        
        if (btn.classList.contains('liked')) {
            btn.classList.remove('liked');
            span.textContent = currentCount - 1;
        } else {
            btn.classList.add('liked');
            span.textContent = currentCount + 1;
            // 添加点赞动画
            btn.classList.add('bounce');
            setTimeout(() => btn.classList.remove('bounce'), 1000);
        }
    }

    handleShare(btn) {
        if (navigator.share) {
            navigator.share({
                title: '分享动态',
                text: '来看看这条有趣的动态',
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('链接已复制到剪贴板', 'success');
            });
        }
    }

    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.showNotification(`已选择 ${files.length} 张图片`, 'info');
                // 这里可以实现图片预览和上传逻辑
            }
        });
        
        input.click();
    }

    insertHashtag() {
        const postContent = document.getElementById('postContent');
        if (postContent) {
            const cursorPos = postContent.selectionStart;
            const textBefore = postContent.value.substring(0, cursorPos);
            const textAfter = postContent.value.substring(cursorPos);
            
            postContent.value = textBefore + '#' + textAfter;
            postContent.selectionStart = postContent.selectionEnd = cursorPos + 1;
            postContent.focus();
            
            this.updateCharCount();
            this.updatePublishButton();
        }
    }

    insertMention() {
        const postContent = document.getElementById('postContent');
        if (postContent) {
            const cursorPos = postContent.selectionStart;
            const textBefore = postContent.value.substring(0, cursorPos);
            const textAfter = postContent.value.substring(cursorPos);
            
            postContent.value = textBefore + '@' + textAfter;
            postContent.selectionStart = postContent.selectionEnd = cursorPos + 1;
            postContent.focus();
            
            this.updateCharCount();
            this.updatePublishButton();
        }
    }

    insertLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.showNotification('位置获取成功', 'success');
                    // 这里可以实现位置信息的处理
                },
                (error) => {
                    this.showNotification('位置获取失败', 'error');
                }
            );
        } else {
            this.showNotification('浏览器不支持位置服务', 'error');
        }
    }

    focusComposer() {
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.focus();
            postContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--card-bg);
            color: var(--text-primary);
            padding: var(--space-md) var(--space-lg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-primary);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        // 根据类型设置颜色
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--accent-green)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--accent-red)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = 'var(--accent-orange)';
            notification.style.borderLeftWidth = '4px';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostComposer;
}

