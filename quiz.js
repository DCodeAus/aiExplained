/* AI Explained - shared game engine: points, levels, quizzes, confetti.
   Progress is saved in the browser via localStorage (per device). */
(function () {
  "use strict";

  var STORE_KEY = "aiex-progress-v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { points: {}, quizzes: {} }; }
    catch (e) { return { points: {}, quizzes: {} }; }
  }
  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load();

  function totalPoints() {
    var t = 0;
    for (var k in state.points) t += state.points[k];
    return t;
  }

  var LEVELS = [
    [0, "🐣 Newcomer"],
    [40, "🔍 Explorer"],
    [90, "⚙️ Apprentice"],
    [150, "🧠 Prompt Pro"],
    [210, "🤖 AI Whisperer"]
  ];
  function levelName(pts) {
    var name = LEVELS[0][1];
    for (var i = 0; i < LEVELS.length; i++) if (pts >= LEVELS[i][0]) name = LEVELS[i][1];
    return name;
  }
  function nextLevelAt(pts) {
    for (var i = 0; i < LEVELS.length; i++) if (pts < LEVELS[i][0]) return LEVELS[i][0];
    return null;
  }

  /* ---------- score chip in nav ---------- */
  var chip;
  function renderChip() {
    var pts = totalPoints();
    if (!chip) {
      var navInner = document.querySelector(".nav-inner");
      if (!navInner) return;
      chip = document.createElement("span");
      chip.className = "score-chip";
      chip.title = "Your progress is saved in this browser";
      navInner.appendChild(chip);
    }
    chip.innerHTML = "⭐ " + pts + " pts · " + levelName(pts);
  }

  /* ---------- award points (once per unique id) ---------- */
  function award(id, pts) {
    if (state.points[id]) return false;      // already earned
    state.points[id] = pts;
    save(state);
    renderChip();
    return true;
  }
  function hasEarned(id) { return !!state.points[id]; }

  /* ---------- floating "+10" ---------- */
  function floatPoints(el, pts) {
    var f = document.createElement("span");
    f.className = "float-pts";
    f.textContent = "+" + pts;
    var r = el.getBoundingClientRect();
    f.style.left = (r.left + r.width / 2) + "px";
    f.style.top = (r.top + window.scrollY - 6) + "px";
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 1400);
  }

  /* ---------- confetti ---------- */
  function confetti() {
    var EMOJI = ["🎉", "✨", "⭐", "🎊", "🏆"];
    for (var i = 0; i < 24; i++) {
      var s = document.createElement("span");
      s.className = "confetti";
      s.textContent = EMOJI[i % EMOJI.length];
      s.style.left = (Math.random() * 100) + "vw";
      s.style.animationDelay = (Math.random() * 0.6) + "s";
      s.style.fontSize = (14 + Math.random() * 18) + "px";
      document.body.appendChild(s);
      (function (node) { setTimeout(function () { node.remove(); }, 3200); })(s);
    }
  }

  /* ---------- question banks ---------- */
  var BANKS = {
    tokens: {
      title: "Tokens",
      badge: "🧩",
      questions: [
        {
          q: "What does an AI model actually process when you send it a sentence?",
          options: ["Whole words, one at a time", "Tokens converted into numbers", "Photographs of the text", "Sound waves"],
          answer: 1,
          why: "Text is split into tokens, and each token becomes a number (its token ID). The model only ever works with those numbers."
        },
        {
          q: "Roughly how many words is 1,000 tokens of English?",
          options: ["About 100 words", "About 750 words", "Exactly 1,000 words", "About 5,000 words"],
          answer: 1,
          why: "The rule of thumb is 1 token ≈ ¾ of a word, so 1,000 tokens ≈ 750 words."
        },
        {
          q: "Why do models sometimes struggle to count the letters in a word like 'strawberry'?",
          options: ["They're bad at fruit", "The word is too long", "They see tokens like 'straw'+'berry', not individual letters", "Counting is banned"],
          answer: 2,
          why: "The model sees whole token chunks - it doesn't naturally see the letters inside them."
        }
      ]
    },
    training: {
      title: "Training",
      badge: "🎓",
      questions: [
        {
          q: "What single game is at the heart of how an LLM learns?",
          options: ["Chess against itself", "Guess the next token", "Spot the difference", "20 questions"],
          answer: 1,
          why: "Pre-training is billions of rounds of 'guess the next token', with the model's parameters nudged after every wrong guess."
        },
        {
          q: "Does chatting with an AI train it, live, as you talk?",
          options: ["Yes, it learns from every message", "Only if you're polite to it", "No - its parameters are frozen while you chat", "Only on weekends"],
          answer: 2,
          why: "Training happens in advance in a data centre. During a chat the model only uses what it already learnt."
        },
        {
          q: "Why do models hallucinate (make things up)?",
          options: ["They enjoy lying", "They generate plausible text, and have no built-in way to say 'no data found'", "Hackers make them do it", "Their internet connection drops out"],
          answer: 1,
          why: "The model's job is producing likely-sounding text. For obscure topics, 'plausible' and 'true' can part ways - and it can't look anything up by default."
        }
      ]
    },
    "using-ai": {
      title: "Using AI",
      badge: "💬",
      questions: [
        {
          q: "Which prompt will get the best result?",
          options: [
            "\"Write about dogs.\"",
            "\"dogs\"",
            "\"Write a friendly 150-word intro to choosing a first dog for apartment renters, mentioning two suitable breeds.\"",
            "\"WRITE ABOUT DOGS!!!\""
          ],
          answer: 2,
          why: "It pins down audience, length, tone, and content. Vague in, vague out."
        },
        {
          q: "What happens when a conversation gets longer than the context window?",
          options: ["The AI gets faster", "The oldest content effectively falls out of the model's view", "Your account is charged extra", "Nothing - it remembers everything forever"],
          answer: 1,
          why: "The context window is finite working memory - like a whiteboard that gets wiped from the oldest end as it fills."
        },
        {
          q: "You ask a model for a statistic and it gives you a precise number with a citation. What should you do?",
          options: ["Trust it - citations prove it's real", "Verify it - names, numbers and citations are the highest-risk outputs", "Ask the model to pinky-promise", "Use it only in important documents"],
          answer: 1,
          why: "Models can hallucinate very convincing citations. Specifics that matter should always be checked."
        }
      ]
    },
    safety: {
      title: "Safe Use",
      badge: "🛡️",
      questions: [
        {
          q: "A friend asks you to paste a spreadsheet of customer names and phone numbers into a chatbot to 'clean it up'. What's the issue?",
          options: ["Spreadsheets are too big for AI", "You'd be sharing other people's personal data with a third-party service without their consent", "Chatbots can't read numbers", "Nothing - AI chats are always private"],
          answer: 1,
          why: "Once personal data leaves your machine it's governed by the AI provider's terms, not yours. Other people's data is never yours to share."
        },
        {
          q: "Which of these is the SAFEST thing to paste into a public AI chatbot?",
          options: ["Your workplace's confidential strategy document", "A password that's 'probably expired'", "A paragraph of your own writing you'd like improved", "A friend's medical details, to get advice for them"],
          answer: 2,
          why: "Your own non-sensitive content is fine. Confidential work material, credentials, and other people's health data are all off-limits."
        },
        {
          q: "You're studying and stuck on an assignment. Which use of AI is the honest one?",
          options: ["Asking it to write the assignment 'in your style'", "Asking it to explain the concept you're stuck on, then doing the work yourself", "Submitting its answer with a few words changed", "Asking it to do the maths but writing the intro yourself"],
          answer: 1,
          why: "Using AI as a tutor builds your skills; submitting its work as yours is an integrity breach - and it robs you of the learning you're paying for."
        }
      ]
    },
    agents: {
      title: "Agents",
      badge: "🦾",
      questions: [
        {
          q: "What turns a plain chatbot into an agent?",
          options: ["A bigger font", "Running it in a loop with access to tools", "More politeness training", "A robot body"],
          answer: 1,
          why: "An agent is an LLM in a think → act → observe loop, with tools like search, files, and code execution."
        },
        {
          q: "What does RAG do?",
          options: ["Makes the model angrier", "Finds relevant documents and gives them to the model before it answers", "Compresses tokens", "Renames the chatbot"],
          answer: 1,
          why: "Retrieval-augmented generation grounds answers in real sources placed into the context window - great for reducing hallucination."
        },
        {
          q: "Why do agent products ask for confirmation before sending an email?",
          options: ["To slow you down on purpose", "Legal fine print", "A wrong action is worse than a wrong sentence - permissions limit the damage", "Emails cost extra tokens"],
          answer: 2,
          why: "Agents inherit hallucination and mistakes but can act on them. Confirmation on consequential actions keeps a human in charge."
        }
      ]
    }
  };

  /* ---------- quiz renderer ---------- */
  function renderQuiz(container) {
    var quizId = container.getAttribute("data-quiz");
    var bank = BANKS[quizId];
    if (!bank) return;

    var done = state.quizzes[quizId];
    var header = document.createElement("div");
    header.className = "quiz-header";
    header.innerHTML = "<span class='quiz-badge'>" + bank.badge + "</span> <strong>Boss level: " + bank.title + " quiz</strong>" +
      "<span class='quiz-status'>" + (done ? "Completed ✓ (" + done.score + "/" + bank.questions.length + ")" : bank.questions.length + " questions · 10 pts each") + "</span>";
    container.appendChild(header);

    var correct = 0, answeredCount = 0;

    bank.questions.forEach(function (item, qi) {
      var qDiv = document.createElement("div");
      qDiv.className = "quiz-q";
      var qText = document.createElement("p");
      qText.className = "quiz-question";
      qText.textContent = (qi + 1) + ". " + item.q;
      qDiv.appendChild(qText);

      var opts = document.createElement("div");
      opts.className = "quiz-opts";
      var answered = false;

      item.options.forEach(function (opt, oi) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-opt";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          answeredCount++;
          var isRight = oi === item.answer;
          btn.classList.add(isRight ? "right" : "wrong");
          opts.querySelectorAll(".quiz-opt").forEach(function (b, bi) {
            b.disabled = true;
            if (bi === item.answer) b.classList.add("right");
          });
          var why = document.createElement("p");
          why.className = "quiz-why " + (isRight ? "right" : "wrong");
          why.innerHTML = (isRight ? "✅ Correct! " : "❌ Not quite. ") + item.why;
          qDiv.appendChild(why);
          if (isRight) {
            correct++;
            if (award(quizId + "-q" + qi, 10)) floatPoints(btn, 10);
          }
          if (answeredCount === bank.questions.length) finish();
        });
        opts.appendChild(btn);
      });

      qDiv.appendChild(opts);
      container.appendChild(qDiv);
    });

    function finish() {
      var prev = state.quizzes[quizId];
      if (!prev || correct > prev.score) {
        state.quizzes[quizId] = { score: correct };
        save(state);
      }
      var summary = document.createElement("div");
      summary.className = "quiz-summary";
      if (correct === bank.questions.length) {
        summary.innerHTML = "🏆 <strong>Perfect score!</strong> You've earned the " + bank.badge + " <strong>" + bank.title + " badge</strong>.";
        if (award(quizId + "-perfect", 15)) { confetti(); floatPoints(summary, 15); }
        else confetti();
      } else {
        summary.innerHTML = "You scored <strong>" + correct + "/" + bank.questions.length + "</strong>. Re-read the page and press <em>Retry</em> to earn the badge with a perfect score.";
        var retry = document.createElement("button");
        retry.type = "button";
        retry.className = "quiz-retry";
        retry.textContent = "Retry quiz ↻";
        retry.addEventListener("click", function () {
          container.innerHTML = "";
          renderQuiz(container);
        });
        summary.appendChild(document.createElement("br"));
        summary.appendChild(retry);
      }
      container.appendChild(summary);
      header.querySelector(".quiz-status").textContent = "Completed ✓ (" + correct + "/" + bank.questions.length + ")";
      renderChip();
      document.dispatchEvent(new CustomEvent("aiex-progress"));
    }
  }

  /* ---------- progress dashboard (home page) ---------- */
  function renderDashboard(container) {
    function draw() {
      var pts = totalPoints();
      var next = nextLevelAt(pts);
      var pctToNext = next ? Math.min(100, Math.round((pts / next) * 100)) : 100;
      var badges = ["tokens", "training", "using-ai", "agents", "safety"].map(function (id) {
        var b = BANKS[id];
        var earned = hasEarned(id + "-perfect");
        return "<span class='badge " + (earned ? "earned" : "") + "' title='" + b.title + (earned ? " badge earned!" : " - get a perfect quiz score to earn") + "'>" + b.badge + "<small>" + b.title + "</small></span>";
      }).join("");
      var capEarned = hasEarned("capstone-complete");
      badges += "<span class='badge " + (capEarned ? "earned" : "") + "' title='" + (capEarned ? "Final Challenge completed!" : "Complete the Final Challenge to earn") + "'>🏁<small>Challenge</small></span>";
      container.innerHTML =
        "<div class='dash-row'><strong>" + levelName(pts) + "</strong><span>⭐ " + pts + " pts" + (next ? " · next level at " + next : " · max level!") + "</span></div>" +
        "<div class='dash-track'><div class='dash-bar' style='width:" + pctToNext + "%'></div></div>" +
        "<div class='dash-badges'>" + badges + "</div>" +
        (pts === 0 ? "<p class='dash-hint'>Earn points in the demos and quizzes on each page. Collect all four badges to complete the course! Progress saves in this browser.</p>" : "");
    }
    draw();
    document.addEventListener("aiex-progress", draw);
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChip();
    document.querySelectorAll("[data-quiz]").forEach(renderQuiz);
    var dash = document.getElementById("progress-dash");
    if (dash) renderDashboard(dash);
  });

  /* expose for page demos */
  window.AIEX = { award: award, hasEarned: hasEarned, floatPoints: floatPoints, confetti: confetti };
})();
