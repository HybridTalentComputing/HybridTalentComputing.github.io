let currentDocId = null;
const docs = [];

// 从docs目录加载所有markdown文件
async function loadAllMarkdownFiles() {
    try {
        const response = await fetch('/docs/index.json');
        const fileList = await response.json();
        
        for (const file of fileList) {
            const fileResponse = await fetch(`/docs/${file}`);
            const content = await fileResponse.text();
            
            const title = content.split('\n')[0].replace('#', '').trim();
            const id = file.replace('.md', '');
            
            docs.push({
                id: id,
                title: title,
                content: content
            });
        }
    } catch (error) {
        console.error('加载Markdown文件失败:', error);
        // 如果加载失败，至少加载示例文档
        try {
            const response = await fetch('/docs/example.md');
            const content = await response.text();
            
            const title = content.split('\n')[0].replace('#', '').trim();
            docs.push({
                id: 'example',
                title: title,
                content: content
            });
        } catch (fallbackError) {
            console.error('加载示例文档也失败:', fallbackError);
        }
    }
    renderDocsList();
}

// 初始化文档系统
async function initDocs() {
    await loadAllMarkdownFiles();
}

// 渲染文档列表
function renderDocsList() {
    const docsContainer = document.getElementById('docs-list');
    if (!docs || docs.length === 0) {
        docsContainer.innerHTML = `
            <div class="empty-docs">
                <p>暂无可用文档</p>
            </div>
        `;
        return;
    }

    // 按文档标题排序
    const sortedDocs = [...docs].sort((a, b) => a.title.localeCompare(b.title));

    docsContainer.innerHTML = sortedDocs.map(doc => `
        <div class="doc-card" onclick="window.location.href='doc.html?id=${doc.id}'">
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
        // 使用marked.js渲染Markdown内容，并配置选项
        const markedOptions = {
            gfm: true,
            breaks: true,
            highlight: function(code, lang) {
                if (Prism && lang) {
                    try {
                        return Prism.highlight(code, Prism.languages[lang], lang);
                    } catch (e) {
                        return code;
                    }
                }
                return code;
            }
        };
        marked.setOptions(markedOptions);
        contentElement.innerHTML = marked.parse(doc.content);
        contentElement.style.display = 'block';
        
        // 更新文档列表中的激活状态
        renderDocsList();

        // 确保预览区域可见并有适当的样式
        contentElement.classList.add('active');
        
        // 滚动到文档内容区域
        contentElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initDocs();
});