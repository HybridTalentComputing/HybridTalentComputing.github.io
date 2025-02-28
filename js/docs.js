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
                <p>暂无文档</p>
            </div>
        `;
        return;
    }

    docsContainer.innerHTML = docs.map(doc => `
        <div class="doc-card" onclick="showDocument('${doc.id}')">
            <h3>${doc.title}</h3>
            <p class="doc-preview">${doc.content.substring(0, 100)}${doc.content.length > 100 ? '...' : ''}</p>
        </div>
    `).join('');
}

// 显示文档内容
function showDocument(docId) {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
        currentDocId = docId;
        const contentElement = document.getElementById('preview-content');
        contentElement.innerHTML = marked.parse(doc.content);
        contentElement.style.display = 'block';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initDocs();
});