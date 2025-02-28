let editor;
let currentDocId = null;
const docs = JSON.parse(localStorage.getItem('docs') || '[]');

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
}

// 渲染文档列表
function renderDocsList() {
    const docsContainer = document.getElementById('docs-list');
    docsContainer.innerHTML = docs.map(doc => `
        <div class="doc-card" onclick="openDoc('${doc.id}')">
            <h3>${doc.title}</h3>
            <p>${doc.content.substring(0, 100)}...</p>
            <div class="doc-meta">
                <p>创建时间: ${new Date(doc.createdAt).toLocaleString()}</p>
                <p>最后更新: ${new Date(doc.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

// 创建新文档
function createNewDoc() {
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

// 保存文档
function saveDocument() {
    const title = document.getElementById('doc-title').value.trim();
    const content = editor.value().trim();

    if (!title || !content) {
        alert('标题和内容不能为空！');
        return;
    }

    if (currentDocId) {
        // 更新现有文档
        const docIndex = docs.findIndex(d => d.id === currentDocId);
        if (docIndex !== -1) {
            docs[docIndex] = {
                ...docs[docIndex],
                title,
                content,
                updatedAt: Date.now()
            };
        }
    } else {
        // 创建新文档
        docs.push({
            id: Date.now().toString(),
            title,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }

    localStorage.setItem('docs', JSON.stringify(docs));
    renderDocsList();
    closeEditor();
}

// 关闭编辑器
function closeEditor() {
    document.getElementById('editor-container').style.display = 'none';
    currentDocId = null;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    renderDocsList();
});