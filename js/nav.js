document.addEventListener('DOMContentLoaded', () => {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    // 初始化显示状态
    function initializeDisplay() {
        const hash = window.location.hash || '#docs';
        updateActiveTab(hash);
    }

    // 更新激活的标签和显示相应的内容
    function updateActiveTab(hash) {
        const targetId = hash.slice(1);

        // 更新标签状态
        navTabs.forEach(tab => {
            if (tab.getAttribute('href') === hash) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // 更新内容显示
        sections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = 'block';
                // 添加淡入动画
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                });
            } else {
                section.style.display = 'none';
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            }
        });
    }

    // 监听标签点击事件
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = tab.getAttribute('href');
            history.pushState(null, '', hash);
            updateActiveTab(hash);
        });
    });

    // 监听浏览器后退/前进事件
    window.addEventListener('popstate', () => {
        updateActiveTab(window.location.hash || '#docs');
    });

    // 初始化显示
    initializeDisplay();
});