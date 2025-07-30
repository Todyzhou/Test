// 个人主页功能
class ProfilePage {
    constructor() {
        this.currentUser = '';
        this.currentTab = 'posts';
        this.timeline = null;
        this.isOwnProfile = false;
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.initComponents();
        this.bindEvents();
        this.loadUserData();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentUser = urlParams.get('user') || 'alice_dev';
        
        // 判断是否是自己的主页
        this.isOwnProfile = this.currentUser === 'current_user' || !urlParams.get('user');
        
        // 更新页面标题
        document.title = `@${this.currentUser} - 话题社区`;
    }

    initComponents() {
        // 初始化时间线（针对特定用户）
        this.timeline = new ProfileTimeline(this.currentUser);
    }

    bindEvents() {
        // 关注用户按钮
        this.setupFollowButton();
        
        // 私信按钮
        this.setupMessageButton();
        
        // 标签页切换
        this.setupTabs();
        
        // 统计数据点击
        this.setupStatsClick();
    }

    setupFollowButton() {
        const followBtn = document.getElementById('followUserBtn');
        
        if (followBtn) {
            // 如果是自己的主页，隐藏关注按钮
            if (this.isOwnProfile) {
                followBtn.style.display = 'none';
                const messageBtn = document.getElementById('messageUserBtn');
                if (messageBtn) {
                    messageBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑资料';
                    messageBtn.addEventListener('click', () => {
                        this.editProfile();
                    });
                }
            } else {
                followBtn.addEventListener('click', () => {
                    this.toggleFollowUser(followBtn);
                });
            }
        }
    }

    toggleFollowUser(btn) {
        const isFollowing = btn.classList.contains('following');
        
        if (isFollowing) {
            btn.classList.remove('following');
            btn.innerHTML = '<i class="fas fa-plus"></i> 关注';
            this.showNotification('已取消关注', 'info');
            this.updateFollowerCount(-1);
        } else {
            btn.classList.add('following');
            btn.innerHTML = '<i class="fas fa-check"></i> 已关注';
            this.showNotification('关注成功', 'success');
            this.updateFollowerCount(1);
        }
        
        // 发送API请求更新关注状态
        this.updateUserFollowStatus(this.currentUser, !isFollowing);
    }

    async updateUserFollowStatus(username, isFollowing) {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`${isFollowing ? '关注' : '取消关注'}用户:`, username);
        } catch (error) {
            console.error('更新用户关注状态失败:', error);
            this.showNotification('操作失败，请重试', 'error');
        }
    }

    updateFollowerCount(delta) {
        const followersCount = document.getElementById('followersCount');
        if (followersCount) {
            const currentCount = this.parseNumber(followersCount.textContent);
            const newCount = currentCount + delta;
            followersCount.textContent = this.formatNumber(newCount);
        }
    }

    setupMessageButton() {
        const messageBtn = document.getElementById('messageUserBtn');
        
        if (messageBtn && !this.isOwnProfile) {
            messageBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    sendMessage() {
        // 这里可以打开私信对话框或跳转到私信页面
        this.showNotification('私信功能开发中...', 'info');
    }

    editProfile() {
        // 这里可以打开编辑资料的模态框或跳转到编辑页面
        this.showNotification('编辑资料功能开发中...', 'info');
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab, btn);
            });
        });
    }

    switchTab(tab, activeBtn) {
        // 更新按钮状态
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
        
        // 更新当前标签页
        this.currentTab = tab;
        
        // 重新加载内容
        this.loadTabContent(tab);
    }

    async loadTabContent(tab) {
        const tabContent = document.getElementById('tabContent');
        const timeline = document.getElementById('timeline');
        const loadMore = document.getElementById('loadMore');
        
        if (!tabContent) return;
        
        // 显示加载状态
        this.showLoadingState();
        
        try {
            switch (tab) {
                case 'posts':
                    await this.timeline.loadUserPosts(this.currentUser, 'posts');
                    timeline.style.display = 'flex';
                    loadMore.style.display = 'block';
                    break;
                case 'replies':
                    await this.timeline.loadUserPosts(this.currentUser, 'replies');
                    timeline.style.display = 'flex';
                    loadMore.style.display = 'block';
                    break;
                case 'media':
                    this.showEmptyState('媒体', '暂无媒体内容', 'fas fa-image');
                    timeline.style.display = 'none';
                    loadMore.style.display = 'none';
                    break;
                case 'likes':
                    await this.timeline.loadUserPosts(this.currentUser, 'likes');
                    timeline.style.display = 'flex';
                    loadMore.style.display = 'block';
                    break;
            }
        } catch (error) {
            console.error('加载标签页内容失败:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = this.generateSkeletonHTML();
        }
    }

    showEmptyState(title, message, icon) {
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = `
                <div class="empty-state">
                    <i class="${icon}"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>加载失败</h3>
                    <p>内容加载失败，请刷新页面重试</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: var(--space-md);">刷新页面</button>
                </div>
            `;
        }
    }

    generateSkeletonHTML() {
        return Array(3).fill().map(() => `
            <div class="post-card">
                <div class="post-header">
                    <div class="skeleton skeleton-avatar" style="width: 40px; height: 40px;"></div>
                    <div style="flex: 1; margin-left: 16px;">
                        <div class="skeleton skeleton-text" style="width: 120px; height: 16px;"></div>
                        <div class="skeleton skeleton-text" style="width: 80px; height: 14px;"></div>
                    </div>
                </div>
                <div class="post-content" style="margin: 16px 0;">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                </div>
                <div class="post-actions">
                    <div class="skeleton" style="width: 60px; height: 20px;"></div>
                    <div class="skeleton" style="width: 60px; height: 20px;"></div>
                    <div class="skeleton" style="width: 60px; height: 20px;"></div>
                    <div class="skeleton" style="width: 30px; height: 20px;"></div>
                </div>
            </div>
        `).join('');
    }

    setupStatsClick() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                if (tab) {
                    // 找到对应的标签页按钮并点击
                    const tabButton = document.querySelector(`.tab-button[data-tab="${tab}"]`);
                    if (tabButton) {
                        tabButton.click();
                    }
                }
            });
        });
    }

    async loadUserData() {
        try {
            // 模拟加载用户数据
            const userData = await this.fetchUserData(this.currentUser);
            this.updateUserInfo(userData);
        } catch (error) {
            console.error('加载用户数据失败:', error);
        }
    }

    async fetchUserData(username) {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟用户数据
        const mockUsers = {
            'alice_dev': {
                name: 'Alice Chen',
                handle: 'alice_dev',
                avatar: 'A',
                bio: '前端工程师 | 设计爱好者 | 开源贡献者\n热爱技术，喜欢分享，相信代码可以改变世界 ✨',
                location: '北京，中国',
                website: 'alice-dev.com',
                joinDate: '2021年3月',
                stats: {
                    posts: 1234,
                    following: 567,
                    followers: 8901,
                    likes: 23400
                },
                isFollowing: Math.random() > 0.5
            },
            'bob_ai': {
                name: 'Bob Wang',
                handle: 'bob_ai',
                avatar: 'B',
                bio: 'AI研究员 | 技术博主\n专注于机器学习和深度学习研究',
                location: '上海，中国',
                website: 'bob-ai.tech',
                joinDate: '2020年8月',
                stats: {
                    posts: 892,
                    following: 234,
                    followers: 5678,
                    likes: 15600
                },
                isFollowing: Math.random() > 0.5
            }
        };
        
        return mockUsers[username] || mockUsers['alice_dev'];
    }

    updateUserInfo(userData) {
        // 更新头像
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = `https://via.placeholder.com/120x120/4a5568/ffffff?text=${userData.avatar}`;
            profileAvatar.alt = userData.name;
        }
        
        // 更新姓名和用户名
        const profileName = document.getElementById('profileName');
        const profileHandle = document.getElementById('profileHandle');
        if (profileName) profileName.textContent = userData.name;
        if (profileHandle) profileHandle.textContent = `@${userData.handle}`;
        
        // 更新简介
        const profileBio = document.getElementById('profileBio');
        if (profileBio) {
            profileBio.innerHTML = userData.bio.replace(/\n/g, '<br>');
        }
        
        // 更新统计数据
        const postsCount = document.getElementById('postsCount');
        const followingCount = document.getElementById('followingCount');
        const followersCount = document.getElementById('followersCount');
        const likesCount = document.getElementById('likesCount');
        
        if (postsCount) postsCount.textContent = this.formatNumber(userData.stats.posts);
        if (followingCount) followingCount.textContent = this.formatNumber(userData.stats.following);
        if (followersCount) followersCount.textContent = this.formatNumber(userData.stats.followers);
        if (likesCount) likesCount.textContent = this.formatNumber(userData.stats.likes);
        
        // 更新关注按钮状态
        const followBtn = document.getElementById('followUserBtn');
        if (followBtn && userData.isFollowing && !this.isOwnProfile) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> 已关注';
        }
    }

    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 10000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000) return (num / 10000).toFixed(1) + '万';
        return (num / 1000000).toFixed(1) + 'M';
    }

    parseNumber(str) {
        // 将格式化的数字字符串转换回数字
        if (str.includes('K')) {
            return parseFloat(str.replace('K', '')) * 1000;
        } else if (str.includes('万')) {
            return parseFloat(str.replace('万', '')) * 10000;
        } else if (str.includes('M')) {
            return parseFloat(str.replace('M', '')) * 1000000;
        }
        return parseInt(str.replace(/,/g, ''));
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

// 个人主页时间线类（继承自Timeline）
class ProfileTimeline extends Timeline {
    constructor(username) {
        super();
        this.username = username;
    }

    async fetchPosts(page, tab = 'posts') {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成与用户相关的模拟数据
        const mockPosts = this.generateUserPosts(page, tab);
        
        // 模拟没有更多数据的情况
        if (page > 2) {
            return [];
        }
        
        return mockPosts;
    }

    generateUserPosts(page, tab) {
        const posts = [];
        const startIndex = (page - 1) * this.postsPerPage;
        
        const user = {
            name: this.getUserDisplayName(this.username),
            handle: this.username,
            avatar: this.username.charAt(0).toUpperCase()
        };

        // 根据标签页生成不同类型的内容
        const contents = this.getUserContents(this.username, tab);
        
        for (let i = 0; i < this.postsPerPage; i++) {
            const contentIndex = (startIndex + i) % contents.length;
            
            const baseStats = {
                likes: Math.floor(Math.random() * 100),
                retweets: Math.floor(Math.random() * 50),
                replies: Math.floor(Math.random() * 20)
            };
            
            posts.push({
                id: startIndex + i + 1,
                user: user,
                content: contents[contentIndex],
                timestamp: new Date(Date.now() - (startIndex + i) * 3600000 * 2).toLocaleString('zh-CN'),
                likes: baseStats.likes,
                retweets: baseStats.retweets,
                replies: baseStats.replies,
                liked: Math.random() > 0.7,
                retweeted: Math.random() > 0.8
            });
        }
        
        return posts;
    }

    getUserDisplayName(username) {
        const nameMap = {
            'alice_dev': 'Alice Chen',
            'bob_ai': 'Bob Wang',
            'carol_pm': 'Carol Li',
            'david_design': 'David Zhang',
            'eva_data': 'Eva Liu'
        };
        
        return nameMap[username] || username;
    }

    getUserContents(username, tab) {
        const contentMap = {
            'alice_dev': {
                posts: [
                    '今天完成了一个很酷的 #前端项目，使用了最新的 React 18 特性！🚀',
                    '分享一个 CSS Grid 布局的小技巧，希望对大家有帮助 ✨',
                    '刚刚学会了 TypeScript 的高级类型，感觉打开了新世界的大门',
                    '推荐一个很棒的 VS Code 插件，提高开发效率必备！',
                    '今天的代码审查学到了很多，团队协作真的很重要 👥'
                ],
                replies: [
                    '回复 @bob_ai: 这个 AI 工具确实很有用，我也在项目中使用了',
                    '回复 @carol_pm: 产品设计的思路很赞，用户体验确实是关键',
                    '回复 @david_design: 这个设计风格我很喜欢，简洁而不失美感',
                    '回复 @eva_data: 数据分析的角度很独特，学到了新的思路'
                ],
                likes: [
                    '点赞了 @bob_ai 的动态：AI 技术的发展真的很快',
                    '点赞了 @carol_pm 的动态：产品经理的思维模式',
                    '点赞了 @david_design 的动态：设计灵感分享',
                    '点赞了 @eva_data 的动态：数据科学入门指南'
                ]
            }
        };
        
        const userContent = contentMap[username] || contentMap['alice_dev'];
        return userContent[tab] || userContent.posts;
    }

    async loadUserPosts(username, tab = 'posts') {
        this.username = username;
        this.currentPage = 1;
        this.posts = [];
        this.hasMore = true;
        
        this.loading = true;
        this.showLoadingSkeleton();
        
        try {
            const posts = await this.fetchPosts(1, tab);
            this.posts = posts;
            this.renderPosts(posts);
            this.hideLoadingSkeleton();
        } catch (error) {
            console.error('加载用户动态失败:', error);
            this.showError('加载动态失败，请刷新页面重试');
        } finally {
            this.loading = false;
        }
    }
}

// 全局初始化函数
function initProfilePage() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ProfilePage();
        });
    } else {
        new ProfilePage();
    }
}

// 导出以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfilePage, ProfileTimeline, initProfilePage };
}

