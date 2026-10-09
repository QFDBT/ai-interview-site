/* ===== 移动端导航 ===== */
function toggleMenu() {
  var links = document.getElementById('navLinks');
  if (links) { links.classList.toggle('open'); }
}

/* ===== 提示词复制 ===== */
function copyPrompt() {
  var box = document.getElementById('promptBox');
  var btn = document.getElementById('copyBtn');
  if (!box) return;
  var text = box.innerText;
  function done() {
    btn.textContent = '✅ 已复制';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = '📋 一键复制提示词';
      btn.classList.remove('copied');
    }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { alert('复制失败，请手动选中文本复制'); }
  document.body.removeChild(ta);
}

/* ===== 模拟访谈（本地演示脚本，无网络请求） ===== */
var demoScript = [
  {
    ai: '您好！我是本次用户访谈的专员，想和您聊聊养猫和逗猫玩具的话题，大约 15 分钟，信息仅用于产品研究。请问您现在方便吗？您家猫咪多大了？平时白天家里没人时，它一般都在做什么？',
    tag: '开场 · 研究问题①'
  },
  {
    ai: '理解了，猫独自在家确实容易无聊。能举一个具体的例子吗？比如上一次它拆家或半夜跑酷是什么情形？当时您是怎么处理的？',
    tag: '追问场景 · 研究问题①'
  },
  {
    ai: '这些情况听起来挺让您头疼的。那您之前给它买过哪些逗猫玩具？玩的时候有没有什么不满意的地方？',
    tag: '研究问题②'
  },
  {
    ai: '您提到的问题很典型。如果有一款能自己跑、自动避开障碍、还带激光和羽毛的电动逗猫球，您觉得它值多少钱？为什么？',
    tag: '心理价位 · 研究问题③'
  },
  {
    ai: '明白了。这类玩具目前定价是首件 19.9 元、单独购买 43 元，听完这个价格您的第一反应是什么？另外有没有担心过激光伤眼睛、猫把羽毛咬下来吞掉这类安全问题？',
    tag: '价格反应 + 安全 · 研究问题④'
  }
];

var summary = [
  '受访者画像：养猫人，白天猫独处，存在夜间跑酷 / 拆家行为',
  '研究问题①：猫无聊引发行为问题，频率高、主人困扰大',
  '研究问题②：现有玩具新鲜感短、需人手持、有闲置浪费',
  '研究问题③：自动避障三合一有感知价值，心理价位待更多样本验证',
  '研究问题④：价格敏感但可接受首件价；安全（激光/误食）是明确顾虑',
  '待改进：需增加已购用户样本，验证卖点兑现情况'
];

var chatStep = 0;

function addMsg(role, text) {
  var log = document.getElementById('chatLog');
  var wrap = document.createElement('div');
  wrap.className = 'msg ' + role;
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  log.appendChild(wrap);
  log.scrollTop = log.scrollHeight;
}

function addTag(text) {
  var log = document.getElementById('chatLog');
  var div = document.createElement('div');
  div.className = 'msg ai';
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.fontSize = '12px';
  bubble.style.color = '#8a7f78';
  bubble.textContent = '【' + text + '】';
  div.appendChild(bubble);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function nextAiTurn() {
  if (chatStep >= demoScript.length) return;
  var item = demoScript[chatStep];
  addMsg('ai', item.ai);
  addTag(item.tag);
  chatStep++;
}

function endInterview() {
  if (!document.getElementById('chatLog')) return;
  addMsg('ai', '感谢您的时间！以下是本次访谈的结构化纪要：');
  summary.forEach(function (line) { addTag(line.replace('研究问题', '已覆盖 · 研究问题')); });
  var input = document.getElementById('chatInput');
  if (input) { input.value = ''; input.placeholder = '访谈已结束，请刷新页面重新体验'; input.disabled = true; }
}

document.addEventListener('DOMContentLoaded', function () {
  var log = document.getElementById('chatLog');
  var input = document.getElementById('chatInput');
  if (!log || !input) return;

  nextAiTurn();

  function submit() {
    var val = input.value.trim();
    if (!val) return;
    if (input.disabled) return;
    addMsg('user', val);
    input.value = '';
    setTimeout(nextAiTurn, 400);
    if (chatStep >= demoScript.length) {
      setTimeout(function () {
        endInterview();
      }, 900);
    }
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { submit(); }
  });
});
