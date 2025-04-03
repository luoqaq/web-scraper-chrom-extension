// 初始化TurndownService
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// 配置Turndown规则
turndownService.addRule('codeBlocks', {
  filter: ['pre', 'code'],
  replacement: function(content, node) {
    return '```\n' + content + '\n```';
  }
});

const save = (title, content) => {
  // 生成文件名（使用标题并移除所有非法字符）
  const filename = title
    .replace(/[\\/:*?"<>|]/g, '') // 移除Windows文件名中的非法字符
    .replace(/\s+/g, '_') // 将空格替换为下划线
    .replace(/[^a-zA-Z0-9_-]/g, '') // 只保留字母、数字、下划线和连字符
    .substring(0, 100) // 限制文件名长度
    + '.md';

  // 创建Blob对象
  const blob = new Blob([content], { type: 'text/markdown' });

  console.log('URL', URL, URL.prototype)

  console.log('保存文件')
  // 使用chrome.downloads API保存文件
  chrome.runtime.sendMessage({
    action: 'saveMarkdown',
    data: {
      filename: filename,
      url: URL.createObjectURL(blob)
    }
  })
}

// 抓取当前页面内容
const capturePage = (contentClass) => {
  try {
    // 获取主要内容区域，优先使用用户指定的类名
    let mainContent;
    if (contentClass) {
      mainContent = document.querySelector('.' + contentClass);
    }
    
    // 如果没有找到指定类名的元素，则使用默认选择器
    if (!mainContent) {
      mainContent = document.querySelector('.rspress-doc') ||
                   document.querySelector('article') || 
                   document.querySelector('.article-content') || 
                   document.querySelector('.post-content') || 
                   document.querySelector('main') || 
                   document.body;
    }

    // 获取页面标题
    const title = document.title || 'untitled';
    console.log('mainContent', mainContent)
  
    // 转换为Markdown
    const markdown = turndownService.turndown(mainContent);
    
    console.log('markdown', markdown)
    
    save(title, markdown);
    return true;
  } catch (error) {
    console.error('抓取页面失败:', error);
    return false;
  }
};

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 批量抓取所有页面
const captureAllPages = async (contentClass, nextButtonClass) => {
  try {
    // 抓取当前页面
    const captured = capturePage(contentClass);

    const currentUrl = window.location.href
    
    // 向popup发送状态更新
    chrome.runtime.sendMessage({
      action: 'updateCaptureStatus',
      data: {
        success: captured,
        message: captured ? `${currentUrl}页面抓取成功` : `${currentUrl}页面抓取失败`
      }
    });

    // 如果抓取失败，继续下一页而不是抛出错误
    if (!captured) {
      console.error(`当前页面抓取失败，页面URL: ${currentUrl}，继续处理下一页`);
    }

    // 等待一段时间确保页面保存完成
    await delay(2000);

    // 查找下一页按钮，优先使用用户指定的类名
    const nextButton = nextButtonClass 
      ? document.querySelector('.' + nextButtonClass)
      : document.querySelector('.next_9b9a7');

    if (!nextButton) {
      console.log('没有找到下一页按钮，批量抓取完成');
      // 发送完成状态
      chrome.runtime.sendMessage({
        action: 'updateCaptureStatus',
        data: {
          success: true,
          message: '批量抓取完成'
        }
      });
      return true;
    }

    // 点击下一页按钮
    nextButton.click();
    
    // 等待页面加载完成
    await delay(2000);
    
    // 检查页面是否成功更新
    if (window.location.href === currentUrl) {
      console.log('页面未成功更新，跳过当前抓取');
      chrome.runtime.sendMessage({
        action: 'updateCaptureStatus',
        data: {
          success: false,
          message: `${currentUrl}页面更新失败，跳过当前抓取`
        }
      });
    }

    // 递归抓取下一页
    return await captureAllPages(contentClass, nextButtonClass);
  } catch (error) {
    console.error('批量抓取失败:', error);
    throw error;
  }
};

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('监听来自popup的消息', request);
  
  if (request.action === 'captureContent') {
    try {
      const captured = capturePage(request.contentClass);
      sendResponse({ success: captured });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
  
  if (request.action === 'captureAllContent') {
    captureAllPages(request.contentClass, request.nextButtonClass)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});