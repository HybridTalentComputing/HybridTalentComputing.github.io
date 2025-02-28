let currentDocId = null;
const docs = [];

// 从docs目录加载所有markdown文件
async function loadAllMarkdownFiles() {
    try {
        const response = await fetch('/docs/');
        const files = await response.json();
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const fileResponse = await fetch(`/docs/${file}`);
                const content = await fileResponse.text();
                const title = content.split('\n')[0].replace('#', '').trim();
                
                docs.push({
                    id: file.replace('.md', ''),
                    title: title,
                    content: content
                });
            }
        }
        renderDocsList();
    } catch (error) {
        console.error('加载Markdown文件失败:', error);
    }
}

// 初始化文档系统
async function initDocs() {
    await loadAllMarkdownFiles();
    renderDocsList();
}

// 渲染文档列表
function renderDocsList() {
    const docsContainer = document.getElementById('docs-list');
    if (docs.length === 0) {
        docsContainer.innerHTML = `
            <div class="empty-docs">
                <p>暂无文档，请将Markdown文件放置在docs目录下</p>
            </div>
        `;
        return;
    }

    // 按文档标题排序
    const sortedDocs = [...docs].sort((a, b) => a.title.localeCompare(b.title));

    docsContainer.innerHTML = sortedDocs.map(doc => `
        <div class="doc-card" onclick="showDocument('${doc.id}')">
            <h3>${doc.title}</h3>
            <p class="doc-preview">${doc.content.substring(doc.content.indexOf('\n'), doc.content.indexOf('\n') + 150).trim()}...</p>
        </div>
    `).join('');
}

// 显示文档内容
function showDocument(docId) {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
        currentDocId = docId;
        const contentElement = document.getElementById('preview-content');
        // 使用marked.js渲染Markdown内容
        contentElement.innerHTML = marked.parse(doc.content);
        contentElement.style.display = 'block';
        
        // 高亮当前选中的文档卡片
        document.querySelectorAll('.doc-card').forEach(card => {
            card.classList.remove('active');
            if (card.onclick.toString().includes(docId)) {
                card.classList.add('active');
            }
        });

        // 滚动到文档内容区域
        contentElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initDocs();
});