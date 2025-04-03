/*
 * @Author: lijinbo lijinbo.luo@bytedance.com
 * @Date: 2025-04-02 17:07:01
 * @LastEditors: lijinbo lijinbo.luo@bytedance.com
 * @LastEditTime: 2025-04-03 15:03:53
 * @FilePath: /web-scraper-chrome-3.7/background.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 监听来自content script的消息

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveMarkdown') {
    const { filename, url } = request.data;

    console.log('保存文件', filename, url)
    // 设置下载目录为Downloads/web-scraper
    const downloadPath = 'web-scraper';
    chrome.downloads.download({
      url: url,
      filename: `${downloadPath}/${filename}`,
      saveAs: false,
      conflictAction: 'uniquify'
    });
  }
});