let editor;
let currentDocId = null;
const docs = [
    {
        id: 'example',
        title: 'Markdown 语法示例',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

// 加载markdown文件内容
async function loadMarkdownContent() {
    try {
        const response = await fetch('/docs/example.md');
        const content = await response.text();
        docs[0].content = content;
        renderDocsList();
    } catch (error) {
        console.error('加载Markdown文件失败:', error);
    }
}

// 初始化编辑器
function initEditor() {
    editor = new EasyMDE({
        element: document.getElementById('editor'),
        autofocus: true,
        spellChecker: false,
        status: false,
        previewRender: function(plainText) {
            return marked.parse(plainText);
        }
    });

    // 实时预览
    editor.codemirror.on('change', () => {
        const content = editor.value();
        document.getElementById('preview-content').innerHTML = marked.parse(content);
    });

    // 初始化文档列表
    renderDocsList();
}

// 渲染文档列表
function renderDocsList() {
    const docsContainer = document.getElementById('docs-list');
    if (docs.length === 0) {
        docsContainer.innerHTML = `
            <div class="empty-docs">
                <p>暂无文档，点击"创建新文档"按钮开始创建</p>
            </div>
        `;
        return;
    }

    docsContainer.innerHTML = docs.map(doc => `
        <div class="doc-card" onclick="openDoc('${doc.id}')">
            <h3>${doc.title}</h3>
            <p class="doc-preview">${doc.content.substring(0, 100)}${doc.content.length > 100 ? '...' : ''}</p>
            <div class="doc-meta">
                <span class="doc-date">创建于 ${new Date(doc.createdAt).toLocaleDateString()}</span>
                <span class="doc-date">更新于 ${new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
            <div class="doc-actions">
                <button class="doc-edit-btn" onclick="openDoc('${doc.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    编辑
                </button>
            </div>
        </div>
    `).join('');

}

// 创建新文档
function openEditor() {
    currentDocId = null;
    document.getElementById('doc-title').value = '';
    editor.value('');
    document.getElementById('preview-content').innerHTML = '';
    document.getElementById('editor-container').style.display = 'flex';
}

// 打开文档
function openDoc(docId) {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
        currentDocId = docId;
        document.getElementById('doc-title').value = doc.title;
        editor.value(doc.content);
        document.getElementById('preview-content').innerHTML = marked.parse(doc.content);
        document.getElementById('editor-container').style.display = 'flex';
    }
}



// 关闭编辑器
function closeEditor() {
    document.getElementById('editor-container').style.display = 'none';
    currentDocId = null;
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    loadMarkdownContent();
});