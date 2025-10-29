// Sora 视频收集器 - Shadowrocket 端 (V-Final - 过滤缩略图)
console.log("----------------start sora-collector.js v-final-no-thumb------------------");

const GOOGLE_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby9xFi1jHrS9hRouKWAVZ2E13R405tMzn47Y5Qn8TkPPq97x2kwsmHGZMt-2Nv0K6VJ/exec";
const HOOK_SECRET = "kuan";

const requestUrl = $request && $request.url;
if (!requestUrl) {
  $done({}); // 如果没有 $request，立刻退出
}

// 关键修正：
// 1. 必须包含 "videos.openai.com"
// 2. 必须 *不* 包含 "thumbnail" (过滤掉缩略图)

if (requestUrl.includes("videos.openai.com") && !requestUrl.includes("thumbnail")) { 
  
  const idMatch = requestUrl.match(/task_([a-z0-9]+)/i);
  const name = idMatch ? `Sora_${idMatch[1]}` : "Sora视频";

  const payload = {
    name,
    url: requestUrl,
    timestamp: new Date().toISOString(),
    source: "ChatGPT-Sora",
    _secret: HOOK_SECRET
  };
  
  console.log("Sending payload (VIDEO):", payload); // 日志：准备上传视频

  // 发送 POST 请求
  $httpClient.post({
    url: GOOGLE_WEBHOOK_URL,
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  }, (err, resp, data)=>{
    console.log('hello from post callback'); 
    if (err) console.log("❌ 上传失败", err);
    else console.log("✅ 已保存", resp.status);
    
    $done({});
  });

} else {
  // 如果是缩略图，或者其他链接，就跳过
  console.log("Skipping URL (is thumbnail or not video):", requestUrl);
  $done({});
}
