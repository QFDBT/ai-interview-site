/* ===== 提示词折叠控制 ===== */
function togglePrompt() {
  var sec = document.getElementById('promptSection');
  var btn = document.getElementById('promptToggle');
  if (!sec || !btn) return;
  if (sec.style.display === 'none') {
    sec.style.display = 'block';
    btn.textContent = '🔓 收起提示词';
  } else {
    sec.style.display = 'none';
    btn.textContent = '🔒 研究人员入口（点击展开提示词）';
  }
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

/* ===== 正式访谈：13 题，答完自动结束并上交 ===== */
var QUESTIONS = [
  '您好！感谢您参与本次猫咪玩具体验访谈，共 13 个问题，约 3 分钟。第 1 题：请问您家里养了几只猫？猫咪现在多大？',
  '第 2 题：您平时上班或外出时，猫咪一天大概要独自在家多长时间？',
  '第 3 题：猫咪独自在家时，通常会有哪些行为？比如睡觉、拆家、挠沙发、半夜跑酷等，请具体说说。',
  '第 4 题：这些行为里，最让您头疼的是哪一件？大概多久出现一次？',
  '第 5 题：您之前给猫咪买过哪些玩具？',
  '第 6 题：这些玩具里，猫咪最喜欢玩的是哪个？玩了多久就失去兴趣了？',
  '第 7 题：您在使用这些玩具时遇到过什么不满意的地方？比如需要人拿着陪玩、声音太吵、不耐咬、猫很快玩腻等。',
  '第 8 题：如果有一款电动逗猫球，能自己跑、遇到障碍自动转向、还带激光红点和可替换的羽毛配件，您觉得这样的产品对您有用吗？为什么？',
  '第 9 题：关于这类产品，您有哪些担心？比如激光晃到猫眼睛、羽毛被咬下来误食、轮子吵到邻居、充不上电等。',
  '第 10 题：您平时买猫咪玩具，最看重哪几点？请从价格、安全、静音、续航、颜值、耐咬里选出您最看重的三项并排个顺序。',
  '第 11 题：对这类电动逗猫玩具，您觉得多少钱以内您会直接下单？说说您的理由。',
  '第 12 题：有一款在售产品，首件特价 19.9 元（限 1 件），平时单买 43 元。听完这个价格，您的第一反应是什么？',
  '最后一题（第 13 题）：如果这样一款产品能明显减少猫咪独自在家时的无聊和拆家行为，您愿意推荐给身边的猫友吗？您还有什么其他想法或建议？'
];

var currentQ = 0;
var answers = [];
var finished = false;

function addMsg(role, text) {
  var log = document.getElementById('chatLog');
  if (!log) return;
  var wrap = document.createElement('div');
  wrap.className = 'msg ' + role;
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  log.appendChild(wrap);
  log.scrollTop = log.scrollHeight;
}

function addNote(text) {
  var log = document.getElementById('chatLog');
  if (!log) return;
  var div = document.createElement('div');
  div.className = 'msg ai';
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.fontSize = '12px';
  bubble.style.color = '#8a7f78';
  bubble.textContent = text;
  div.appendChild(bubble);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function lockInput() {
  var input = document.getElementById('chatInput');
  if (input) {
    input.value = '';
    input.placeholder = '访谈已完成，感谢您的参与！';
    input.disabled = true;
  }
  var endBtn = document.getElementById('endBtn');
  if (endBtn) endBtn.style.display = 'none';
}

function buildSummary() {
  var lines = [];
  lines.push('【用户访谈记录 · 智能逗猫球项目】');
  lines.push('完成时间：' + new Date().toLocaleString());
  lines.push('答题进度：13/13 已完成');
  lines.push('');
  for (var i = 0; i < answers.length; i++) {
    lines.push('Q' + (i + 1) + '：' + QUESTIONS[i].replace(/^第 ?\d+ ?题[：:]?|^最后一题（第 ?\d+ ?题）[：:]?/, '').replace(/^您好！感谢您参与本次猫咪玩具体验访谈，共 ?13 ?个问题，约 ?3 ?分钟。/, ''));
    lines.push('A' + (i + 1) + '：' + answers[i]);
    lines.push('');
  }
  return lines.join('\n');
}

function finishInterview() {
  if (finished) return;
  finished = true;
  lockInput();
  addMsg('ai', '访谈完成！非常感谢您的耐心回答，您的反馈对我们改进产品非常重要。以下是您的访谈记录：');
  var summary = buildSummary();
  addNote(summary);
  var btnWrap = document.createElement('div');
  btnWrap.style.textAlign = 'center';
  btnWrap.style.padding = '10px 16px 16px';
  btnWrap.style.background = '#fff';
  var copyB = document.createElement('button');
  copyB.className = 'btn btn-primary';
  copyB.textContent = '📤 一键复制访谈记录（发送给 interviewer）';
  copyB.onclick = function () {
    var done = function () {
      copyB.textContent = '✅ 已复制，请粘贴发送给工作人员';
      copyB.classList.add('copied');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summary).then(done).catch(function () { fallbackCopy(summary, done); });
    } else {
      fallbackCopy(summary, done);
    }
  };
  btnWrap.appendChild(copyB);
  var log = document.getElementById('chatLog');
  if (log && log.parentElement) {
    var oldHint = log.parentElement.querySelector('.chat-hint');
    if (oldHint) oldHint.remove();
    log.parentElement.appendChild(btnWrap);
  }
}

function askNext() {
  if (currentQ < QUESTIONS.length) {
    addMsg('ai', QUESTIONS[currentQ]);
  } else {
    finishInterview();
  }
}

function submitAnswer() {
  var input = document.getElementById('chatInput');
  if (!input || finished) return;
  var val = input.value.trim();
  if (!val) {
    input.placeholder = '请先输入您的回答再发送哦…';
    return;
  }
  answers.push(val);
  input.value = '';
  currentQ++;
  if (currentQ < QUESTIONS.length) {
    addNote('第 ' + currentQ + ' / 13 题已完成');
  }
  setTimeout(askNext, 400);
}

function endInterview() {
  if (finished) return;
  if (answers.length === 0) return;
  finishInterview();
}

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('chatInput');
  var log = document.getElementById('chatLog');
  if (!input || !log) return;

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  });

  var endBtn = document.getElementById('endBtn');
  if (endBtn) {
    endBtn.onclick = function () { endInterview(); };
  }

  askNext();
});
