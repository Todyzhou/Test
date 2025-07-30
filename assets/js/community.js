// 社区页面主要功能
class CommunityApp {
    constructor() {
        this.postComposer = null;
        this.timeline = null;
        this.init();
    }

    init() {
        this.initComponents();
        this.bindEvents();
        this.setupNavigation();
        this.setupSearch();
    }

    initComponents() {
        // 初始化动态发布器
        this.postComposer = new PostComposer();
        
        // 初始化时间线
        this.timeline = new Timeline();
    }

    bindEvents() {
        // 用户菜单下拉
        this.setupUserMenu();
        
        // 导航项点击
        this.setupNavigation();
        
        // 搜索功能
        this.setupSearch();
        
        // 通知按钮
        this.setupNotifications();
        
        // 关注按钮
        this.setupFollowButtons();
        
        // 话题点击
        this.setupTopicClicks();
    }

    setupUserMenu() {
        const userAvatar = document.querySelector('.user-avatar');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // 点击其他地方关闭菜单
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userAvatar.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 移除所有活跃状态
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // 添加当前项的活跃状态
                item.classList.add('active');
                
                // 如果是外部链接，让浏览器正常处理
                if (item.getAttribute('href').startsWith('pages/')) {
                    return;
                }
                
                // 处理单页应用导航
                e.preventDefault();
                this.handleNavigation(item.getAttribute('href'));
            });
        });
    }

    handleNavigation(href) {
        // 这里可以实现单页应用的路由逻辑
        console.log('导航到:', href);
        
        // 示例：根据不同的导航项显示不同内容
        switch (href) {
            case '#':
                // 首页 - 显示时间线
                this.showTimeline();
                break;
            case '#discover':
                // 发现页面
                this.showDiscover();
                break;
            case '#notifications':
                // 通知页面
                this.showNotifications();
                break;
            case '#messages':
                // 消息页面
                this.showMessages();
                break;
            case '#bookmarks':
                // 收藏页面
                this.showBookmarks();
                break;
            case '#profile':
                // 个人主页
                this.showProfile();
                break;
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 0) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                }
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    if (query) {
                        this.performSearch(query);
                        // 跳转到搜索结果页面
                        window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    performSearch(query) {
        console.log('搜索:', query);
        // 这里可以实现实时搜索建议
        this.showSearchSuggestions(query);
    }

    showSearchSuggestions(query) {
        // 实现搜索建议下拉框
        const suggestions = [
            `#${query}`,
            `@${query}`,
            `搜索 "${query}" 相关内容`,
            `搜索用户 "${query}"`
        ];
        
        // 这里可以显示搜索建议
        console.log('搜索建议:', suggestions);
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        const messageBtn = document.getElementById('messageBtn');
        
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                // 跳转到通知页面或显示通知下拉
                window.location.href = 'pages/notifications.html';
            });
        }
        
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                // 跳转到消息页面
                console.log('打开消息');
            });
        }
    }

    setupFollowButtons() {
        const followBtns = document.querySelectorAll('.follow-btn');
        
        followBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFollow(btn);
            });
        });
    }

    toggleFollow(btn) {
        const isFollowing = btn.classList.contains('following');
        
        if (isFollowing) {
            btn.classList.remove('following');
            btn.textContent = '关注';
            this.showNotification('已取消关注', 'info');
        } else {
            btn.classList.add('following');
            btn.textContent = '已关注';
            this.showNotification('关注成功', 'success');
        }
        
        // 这里可以发送API请求更新关注状态
        this.updateFollowStatus(btn.dataset.userId, !isFollowing);
    }

    async updateFollowStatus(userId, isFollowing) {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`${isFollowing ? '关注' : '取消关注'}用户:`, userId);
        } catch (error) {
            console.error('更新关注状态失败:', error);
            this.showNotification('操作失败，请重试', 'error');
        }
    }

    setupTopicClicks() {
        const topicItems = document.querySelectorAll('.topic-item');
        
        topicItems.forEach(item => {
            item.addEventListener('click', () => {
                const topicName = item.querySelector('.topic-name').textContent;
                const topicSlug = topicName.replace('#', '');
                window.location.href = `pages/topic.html?topic=${encodeURIComponent(topicSlug)}`;
            });
        });
    }

    // 页面内容切换方法
    showTimeline() {
        console.log('显示时间线');
        // 实现时间线显示逻辑
    }

    showDiscover() {
        console.log('显示发现页面');
        // 实现发现页面逻辑
    }

    showNotifications() {
        console.log('显示通知页面');
        // 实现通知页面逻辑
    }

    showMessages() {
        console.log('显示消息页面');
        // 实现消息页面逻辑
    }

    showBookmarks() {
        console.log('显示收藏页面');
        // 实现收藏页面逻辑
    }

    showProfile() {
        console.log('显示个人主页');
        // 实现个人主页逻辑
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

    // 工具方法
    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        
        return time.toLocaleDateString('zh-CN');
    }

    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 10000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000) return (num / 10000).toFixed(1) + '万';
        return (num / 1000000).toFixed(1) + 'M';
    }

    // 主题切换
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    }

    // 初始化主题
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.add(`${savedTheme}-theme`);
    }
}

// 全局初始化函数
function initCommunityPage() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new CommunityApp();
        });
    } else {
        new CommunityApp();
    }
}

// 导出以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CommunityApp, initCommunityPage };
}

