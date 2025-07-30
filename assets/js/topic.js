// 话题页面功能
class TopicPage {
    constructor() {
        this.currentTopic = '';
        this.currentTab = 'latest';
        this.postComposer = null;
        this.timeline = null;
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.initComponents();
        this.bindEvents();
        this.loadTopicData();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentTopic = urlParams.get('topic') || '前端开发';
        
        // 更新页面标题和话题标题
        document.title = `#${this.currentTopic} - 话题社区`;
        const topicTitle = document.getElementById('topicTitle');
        if (topicTitle) {
            topicTitle.textContent = `#${this.currentTopic}`;
        }
        
        // 更新发布器占位符
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.placeholder = `分享关于 #${this.currentTopic} 的想法...`;
        }
    }

    initComponents() {
        // 初始化动态发布器
        this.postComposer = new PostComposer();
        
        // 初始化时间线（针对特定话题）
        this.timeline = new TopicTimeline(this.currentTopic);
    }

    bindEvents() {
        // 关注话题按钮
        this.setupFollowButton();
        
        // 分享话题按钮
        this.setupShareButton();
        
        // 标签页切换
        this.setupTabs();
        
        // 相关话题点击
        this.setupRelatedTopics();
    }

    setupFollowButton() {
        const followBtn = document.getElementById('followTopicBtn');
        
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.toggleFollowTopic(followBtn);
            });
        }
    }

    toggleFollowTopic(btn) {
        const isFollowing = btn.classList.contains('following');
        
        if (isFollowing) {
            btn.classList.remove('following');
            btn.innerHTML = '<i class="fas fa-plus"></i> 关注话题';
            this.showNotification('已取消关注话题', 'info');
        } else {
            btn.classList.add('following');
            btn.innerHTML = '<i class="fas fa-check"></i> 已关注';
            this.showNotification('关注话题成功', 'success');
        }
        
        // 发送API请求更新关注状态
        this.updateTopicFollowStatus(this.currentTopic, !isFollowing);
    }

    async updateTopicFollowStatus(topic, isFollowing) {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`${isFollowing ? '关注' : '取消关注'}话题:`, topic);
        } catch (error) {
            console.error('更新话题关注状态失败:', error);
            this.showNotification('操作失败，请重试', 'error');
        }
    }

    setupShareButton() {
        const shareBtn = document.getElementById('shareTopicBtn');
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareTopic();
            });
        }
    }

    shareTopic() {
        const shareData = {
            title: `#${this.currentTopic} - 话题社区`,
            text: `来看看 #${this.currentTopic} 话题的精彩讨论`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showNotification('话题链接已复制到剪贴板', 'success');
            });
        }
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
        this.timeline.loadTopicPosts(this.currentTopic, tab);
    }

    setupRelatedTopics() {
        const relatedTopicItems = document.querySelectorAll('.related-topic-item');
        
        relatedTopicItems.forEach(item => {
            item.addEventListener('click', () => {
                const topicName = item.querySelector('.related-topic-name').textContent;
                const topicSlug = topicName.replace('#', '');
                window.location.href = `topic.html?topic=${encodeURIComponent(topicSlug)}`;
            });
        });
    }

    async loadTopicData() {
        try {
            // 模拟加载话题数据
            const topicData = await this.fetchTopicData(this.currentTopic);
            this.updateTopicInfo(topicData);
        } catch (error) {
            console.error('加载话题数据失败:', error);
        }
    }

    async fetchTopicData(topic) {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟话题数据
        const mockData = {
            name: topic,
            description: this.getTopicDescription(topic),
            stats: {
                discussions: Math.floor(Math.random() * 20000) + 5000,
                participants: Math.floor(Math.random() * 5000) + 1000,
                todayNew: Math.floor(Math.random() * 200) + 50
            },
            isFollowing: Math.random() > 0.5
        };
        
        return mockData;
    }

    getTopicDescription(topic) {
        const descriptions = {
            '前端开发': '分享前端开发技术、经验和最新趋势。包括HTML、CSS、JavaScript、React、Vue等相关内容。',
            '人工智能': '探讨人工智能技术发展、机器学习算法、深度学习应用等前沿科技话题。',
            '设计灵感': '分享创意设计作品、设计理念、用户体验设计等视觉和交互设计内容。',
            '科技资讯': '最新科技新闻、产品发布、行业动态和技术趋势分析。',
            '创业': '创业经验分享、商业模式探讨、投资融资信息和创业者故事。'
        };
        
        return descriptions[topic] || `关于 ${topic} 的讨论和分享。`;
    }

    updateTopicInfo(topicData) {
        // 更新统计数据
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = this.formatNumber(topicData.stats.discussions);
            statNumbers[1].textContent = this.formatNumber(topicData.stats.participants);
            statNumbers[2].textContent = topicData.stats.todayNew;
        }
        
        // 更新关注按钮状态
        const followBtn = document.getElementById('followTopicBtn');
        if (followBtn && topicData.isFollowing) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> 已关注';
        }
        
        // 更新描述
        const description = document.querySelector('.topic-description');
        if (description) {
            description.textContent = topicData.description;
        }
    }

    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 10000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000) return (num / 10000).toFixed(1) + '万';
        return (num / 1000000).toFixed(1) + 'M';
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

// 话题时间线类（继承自Timeline）
class TopicTimeline extends Timeline {
    constructor(topic) {
        super();
        this.topic = topic;
    }

    async fetchPosts(page, tab = 'latest') {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成与话题相关的模拟数据
        const mockPosts = this.generateTopicPosts(page, tab);
        
        // 模拟没有更多数据的情况
        if (page > 3) {
            return [];
        }
        
        return mockPosts;
    }

    generateTopicPosts(page, tab) {
        const posts = [];
        const startIndex = (page - 1) * this.postsPerPage;
        
        const mockUsers = [
            { name: 'Alice Chen', handle: 'alice_dev', avatar: 'A' },
            { name: 'Bob Wang', handle: 'bob_ai', avatar: 'B' },
            { name: 'Carol Li', handle: 'carol_pm', avatar: 'C' },
            { name: 'David Zhang', handle: 'david_design', avatar: 'D' },
            { name: 'Eva Liu', handle: 'eva_data', avatar: 'E' }
        ];

        // 根据话题生成相关内容
        const topicContents = this.getTopicContents(this.topic);
        
        for (let i = 0; i < this.postsPerPage; i++) {
            const userIndex = (startIndex + i) % mockUsers.length;
            const contentIndex = (startIndex + i) % topicContents.length;
            const user = mockUsers[userIndex];
            
            const baseStats = {
                likes: Math.floor(Math.random() * 100),
                retweets: Math.floor(Math.random() * 50),
                replies: Math.floor(Math.random() * 20)
            };
            
            // 根据标签页调整统计数据
            if (tab === 'hot') {
                baseStats.likes *= 2;
                baseStats.retweets *= 2;
                baseStats.replies *= 2;
            }
            
            posts.push({
                id: startIndex + i + 1,
                user: user,
                content: topicContents[contentIndex],
                timestamp: new Date(Date.now() - (startIndex + i) * 3600000).toLocaleString('zh-CN'),
                likes: baseStats.likes,
                retweets: baseStats.retweets,
                replies: baseStats.replies,
                liked: Math.random() > 0.7,
                retweeted: Math.random() > 0.8
            });
        }
        
        return posts;
    }

    getTopicContents(topic) {
        const contentMap = {
            '前端开发': [
                `刚刚学会了 CSS Grid 布局，#${topic} 的布局能力真的很强大！`,
                `分享一个 React Hooks 的最佳实践，#${topic} 社区的小伙伴们可以参考`,
                `Vue 3 的 Composition API 用起来真香，#${topic} 开发效率提升了不少`,
                `JavaScript ES2023 的新特性你们都了解了吗？#${topic}`,
                `今天优化了网站性能，Lighthouse 分数提升到 95+！#${topic} #性能优化`,
                `推荐一个很棒的 TypeScript 学习资源，#${topic} 新手必看`,
                `Webpack 5 的模块联邦功能太酷了，#${topic} 微前端的福音`,
                `刚刚完成了一个响应式设计项目，#${topic} #响应式设计`
            ],
            '人工智能': [
                `ChatGPT 的能力真的让人惊叹，#${topic} 的发展速度太快了`,
                `今天学习了机器学习的基础算法，#${topic} 入门之路开始了`,
                `分享一个深度学习的实战项目，#${topic} 爱好者可以试试`,
                `AI 绘画工具越来越强大了，#${topic} 正在改变创意行业`,
                `推荐几个优质的 #${topic} 学习资源和论文`,
                `自然语言处理的最新进展，#${topic} 技术突破不断`,
                `计算机视觉在自动驾驶中的应用，#${topic} 改变世界`,
                `强化学习算法的实际应用案例分享 #${topic}`
            ],
            '设计灵感': [
                `今天看到一个很棒的 UI 设计，#${topic} 分享给大家`,
                `极简主义设计的魅力，#${topic} 少即是多`,
                `色彩搭配的一些心得体会，#${topic} 设计师必看`,
                `用户体验设计的核心原则，#${topic} UX设计`,
                `分享一个创意十足的品牌设计案例 #${topic}`,
                `移动端界面设计的最佳实践 #${topic} #移动设计`,
                `图标设计的技巧和方法分享 #${topic}`,
                `设计系统的构建经验总结 #${topic} #设计系统`
            ]
        };
        
        return contentMap[topic] || [
            `关于 #${topic} 的一些思考和分享`,
            `今天学习了 #${topic} 相关的知识`,
            `分享一个 #${topic} 的实用技巧`,
            `#${topic} 领域的最新动态值得关注`,
            `推荐一些 #${topic} 的优质资源`
        ];
    }

    async loadTopicPosts(topic, tab = 'latest') {
        this.topic = topic;
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
            console.error('加载话题动态失败:', error);
            this.showError('加载动态失败，请刷新页面重试');
        } finally {
            this.loading = false;
        }
    }
}

// 全局初始化函数
function initTopicPage() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new TopicPage();
        });
    } else {
        new TopicPage();
    }
}

// 导出以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TopicPage, TopicTimeline, initTopicPage };
}

