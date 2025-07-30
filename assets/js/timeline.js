// 时间线功能
class Timeline {
    constructor() {
        this.posts = [];
        this.currentPage = 1;
        this.postsPerPage = 10;
        this.loading = false;
        this.hasMore = true;
        this.init();
    }

    init() {
        this.loadInitialPosts();
        this.bindEvents();
        this.setupInfiniteScroll();
    }

    bindEvents() {
        const loadMoreBtn = document.querySelector('.load-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePosts();
            });
        }
    }

    setupInfiniteScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // 当滚动到距离底部200px时开始加载
        if (scrollTop + windowHeight >= documentHeight - 200) {
            if (!this.loading && this.hasMore) {
                this.loadMorePosts();
            }
        }
    }

    async loadInitialPosts() {
        this.loading = true;
        this.showLoadingSkeleton();
        
        try {
            const posts = await this.fetchPosts(1);
            this.posts = posts;
            this.renderPosts(posts);
            this.hideLoadingSkeleton();
        } catch (error) {
            console.error('加载动态失败:', error);
            this.showError('加载动态失败，请刷新页面重试');
        } finally {
            this.loading = false;
        }
    }

    async loadMorePosts() {
        if (this.loading || !this.hasMore) return;
        
        this.loading = true;
        this.showLoadingButton();
        
        try {
            const newPosts = await this.fetchPosts(this.currentPage + 1);
            
            if (newPosts.length === 0) {
                this.hasMore = false;
                this.hideLoadMoreButton();
                return;
            }
            
            this.posts = [...this.posts, ...newPosts];
            this.renderPosts(newPosts, true);
            this.currentPage++;
            
        } catch (error) {
            console.error('加载更多动态失败:', error);
            this.showNotification('加载失败，请重试', 'error');
        } finally {
            this.loading = false;
            this.hideLoadingButton();
        }
    }

    async fetchPosts(page) {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        const mockPosts = this.generateMockPosts(page);
        
        // 模拟没有更多数据的情况
        if (page > 3) {
            return [];
        }
        
        return mockPosts;
    }

    generateMockPosts(page) {
        const posts = [];
        const startIndex = (page - 1) * this.postsPerPage;
        
        const mockUsers = [
            { name: 'Alice Chen', handle: 'alice_dev', avatar: 'A' },
            { name: 'Bob Wang', handle: 'bob_ai', avatar: 'B' },
            { name: 'Carol Li', handle: 'carol_pm', avatar: 'C' },
            { name: 'David Zhang', handle: 'david_design', avatar: 'D' },
            { name: 'Eva Liu', handle: 'eva_data', avatar: 'E' }
        ];

        const mockContents = [
            '刚刚完成了一个很酷的 #前端项目，使用了最新的 React 18 特性！感觉收获满满 🚀',
            '今天学习了 #人工智能 的基础知识，发现机器学习真的很有趣。有没有推荐的入门资源？',
            '分享一个 #设计灵感：极简主义的力量在于用最少的元素传达最多的信息 ✨',
            '#科技资讯 苹果发布了新的开发者工具，看起来对移动开发者很友好',
            '周末愉快！准备去咖啡厅写代码，有什么好的 #编程音乐 推荐吗？🎵',
            '刚刚读完一本关于 #产品设计 的书，里面的用户体验理念很值得思考',
            '今天的 #代码审查 让我学到了很多，团队协作真的很重要 👥',
            '分享一个调试技巧：使用浏览器开发者工具的 Performance 面板可以快速定位性能问题',
            '#创业感悟 做产品最重要的是理解用户真正的需求，而不是我们认为的需求',
            '刚刚部署了一个新功能，用户反馈很积极！开发者的成就感就是这样来的 😊'
        ];

        for (let i = 0; i < this.postsPerPage; i++) {
            const userIndex = (startIndex + i) % mockUsers.length;
            const contentIndex = (startIndex + i) % mockContents.length;
            const user = mockUsers[userIndex];
            
            posts.push({
                id: startIndex + i + 1,
                user: user,
                content: mockContents[contentIndex],
                timestamp: new Date(Date.now() - (startIndex + i) * 3600000).toLocaleString('zh-CN'),
                likes: Math.floor(Math.random() * 100),
                retweets: Math.floor(Math.random() * 50),
                replies: Math.floor(Math.random() * 20),
                liked: Math.random() > 0.7,
                retweeted: Math.random() > 0.8
            });
        }
        
        return posts;
    }

    renderPosts(posts, append = false) {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        if (!append) {
            timeline.innerHTML = '';
        }

        posts.forEach(post => {
            const postCard = this.createPostCard(post);
            timeline.appendChild(postCard);
        });
    }

    createPostCard(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card fade-in';
        postCard.dataset.postId = post.id;
        
        const processedContent = this.processContent(post.content);
        
        postCard.innerHTML = `
            <div class="post-header">
                <img src="https://via.placeholder.com/40x40/4a5568/ffffff?text=${post.user.avatar}" 
                     alt="${post.user.name}" class="avatar avatar-lg">
                <div class="post-user-info">
                    <div class="post-username">${post.user.name}</div>
                    <div class="post-handle">@${post.user.handle}</div>
                </div>
                <div class="post-time">${post.timestamp}</div>
            </div>
            <div class="post-content">${processedContent}</div>
            <div class="post-actions">
                <button class="action-btn" data-action="reply">
                    <i class="fas fa-reply"></i>
                    <span>${post.replies}</span>
                </button>
                <button class="action-btn ${post.retweeted ? 'retweeted' : ''}" data-action="retweet">
                    <i class="fas fa-retweet"></i>
                    <span>${post.retweets}</span>
                </button>
                <button class="action-btn ${post.liked ? 'liked' : ''}" data-action="like">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="action-btn" data-action="share">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        `;

        // 绑定动作按钮事件
        this.bindPostActions(postCard);
        
        return postCard;
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
                const postId = postCard.dataset.postId;
                
                switch (action) {
                    case 'reply':
                        this.handleReply(postId, btn);
                        break;
                    case 'retweet':
                        this.handleRetweet(postId, btn);
                        break;
                    case 'like':
                        this.handleLike(postId, btn);
                        break;
                    case 'share':
                        this.handleShare(postId, btn);
                        break;
                }
            });
        });
    }

    handleReply(postId, btn) {
        // 滚动到发布器并聚焦
        const postComposer = document.getElementById('postComposer');
        const postContent = document.getElementById('postContent');
        
        if (postComposer && postContent) {
            postComposer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                postContent.focus();
            }, 500);
        }
    }

    handleRetweet(postId, btn) {
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
        
        // 更新本地数据
        const post = this.posts.find(p => p.id == postId);
        if (post) {
            post.retweeted = btn.classList.contains('retweeted');
            post.retweets = parseInt(span.textContent);
        }
    }

    handleLike(postId, btn) {
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
        
        // 更新本地数据
        const post = this.posts.find(p => p.id == postId);
        if (post) {
            post.liked = btn.classList.contains('liked');
            post.likes = parseInt(span.textContent);
        }
    }

    handleShare(postId, btn) {
        const post = this.posts.find(p => p.id == postId);
        if (!post) return;
        
        const shareData = {
            title: `${post.user.name}的动态`,
            text: post.content.substring(0, 100) + '...',
            url: `${window.location.origin}/post/${postId}`
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showNotification('链接已复制到剪贴板', 'success');
            });
        }
    }

    showLoadingSkeleton() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        const skeletonHTML = Array(5).fill().map(() => `
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
        
        timeline.innerHTML = skeletonHTML;
    }

    hideLoadingSkeleton() {
        // 骨架屏会在renderPosts时被替换
    }

    showLoadingButton() {
        const loadBtn = document.querySelector('.load-btn');
        if (loadBtn) {
            loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            loadBtn.disabled = true;
        }
    }

    hideLoadingButton() {
        const loadBtn = document.querySelector('.load-btn');
        if (loadBtn) {
            loadBtn.innerHTML = '加载更多';
            loadBtn.disabled = false;
        }
    }

    hideLoadMoreButton() {
        const loadMore = document.getElementById('loadMore');
        if (loadMore) {
            loadMore.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--space-lg);">没有更多内容了</p>';
        }
    }

    showError(message) {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        timeline.innerHTML = `
            <div class="error-state" style="text-align: center; padding: var(--space-2xl); color: var(--text-muted);">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: var(--space-lg); color: var(--accent-orange);"></i>
                <p style="font-size: var(--text-lg); margin-bottom: var(--space-md);">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">刷新页面</button>
            </div>
        `;
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
    module.exports = Timeline;
}

