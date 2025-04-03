/*
 * @Author: lijinbo lijinbo.luo@bytedance.com
 * @Date: 2025-04-02 17:06:44
 * @LastEditors: lijinbo lijinbo.luo@bytedance.com
 * @LastEditTime: 2025-04-03 15:10:34
 * @FilePath: /web-scraper-chrome-3.7/popup.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 页面加载时读取保存的类名
document.addEventListener('DOMContentLoaded', async () => {
  const { contentClass = '', nextButtonClass = '' } = await chrome.storage.local.get(['contentClass', 'nextButtonClass']);
  console.log('获取类名', contentClass, nextButtonClass)
  document.getElementById('contentClass').value = contentClass;
  document.getElementById('nextButtonClass').value = nextButtonClass;
});

// 监听输入框变化，保存类名
document.getElementById('contentClass').addEventListener('input', async (e) => {
  console.log('保存类名', e.target.value)
  await chrome.storage.local.set({ contentClass: e.target.value });
});

document.getElementById('nextButtonClass').addEventListener('input', async (e) => {
  await chrome.storage.local.set({ nextButtonClass: e.target.value });
});

document.getElementById('captureBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = '正在抓取页面内容...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 发送消息给content script抓取页面内容
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'captureContent',
      contentClass: document.getElementById('contentClass').value
    });
    
    if (response.success) {
      statusDiv.textContent = '内容已保存为Markdown文件';
    } else {
      statusDiv.textContent = '抓取失败: ' + response.error;
    }
  } catch (error) {
    statusDiv.textContent = '发生错误: ' + error.message;
  }
});

// 处理抓取所有页面的按钮点击事件
document.getElementById('captureAllBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('statusAll');
  statusDiv.textContent = '开始批量抓取页面...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 发送消息给content script开始批量抓取
    await chrome.tabs.sendMessage(tab.id, { 
      action: 'captureAllContent',
      contentClass: document.getElementById('contentClass').value,
      nextButtonClass: document.getElementById('nextButtonClass').value
    });
  } catch (error) {
    statusDiv.textContent = '发生错误: ' + error.message;
  }
});

// 监听来自content script的状态更新消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCaptureStatus') {
    const statusDiv = document.getElementById('statusAll');
    const { success, message } = request.data;
    
    // 追加新状态，保留之前的状态记录
    statusDiv.textContent += '\n' + message;
  }
});