/**
 * Interactive Developer Terminal Console
 * Allows recruiters & developers to explore Aws Hameed's profile via CLI
 */
(function() {
  const modal = document.getElementById('terminal-modal');
  const openBtn = document.getElementById('open-terminal-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const body = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-input');

  if (!modal || !input) return;

  let history = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<span class="text-cyan-400 font-bold">AVAILABLE COMMANDS:</span>
  <span class="text-yellow-400">about</span>       - Read bio and background
  <span class="text-yellow-400">projects</span>    - List all selected production projects
  <span class="text-yellow-400">skills</span>      - View complete tech stack & proficiencies
  <span class="text-yellow-400">experience</span>  - View professional career history
  <span class="text-yellow-400">education</span>   - Academic background & university details
  <span class="text-yellow-400">contact</span>     - How to reach Aws Hameed
  <span class="text-yellow-400">resume</span>      - View resume details
  <span class="text-yellow-400">matrix</span>      - Run interactive digital rain
  <span class="text-yellow-400">sudo hire</span>   - Special prompt for recruiters & founders
  <span class="text-yellow-400">clear</span>       - Clear the terminal screen
  <span class="text-yellow-400">exit</span>        - Close the terminal window
`,

    about: () => `
<span class="text-purple-400 font-bold">ABOUT AWS HAMEED:</span>
- <span class="text-slate-200">Current Role:</span> Chief Technology Officer @ Evoke Perfume & Digital Growth Specialist @ SYNAPSEBIZ
- <span class="text-slate-200">University:</span> University of Central Punjab (UCP), Lahore (3rd Semester)
- <span class="text-slate-200">Focus:</span> Full-Stack Architecture, Scalable VPS Deployments, Automated Python Pipelines, C++ Systems
- <span class="text-slate-200">Motto:</span> "I turn ideas into working software."
`,

    projects: () => `
<span class="text-emerald-400 font-bold">SELECTED PRODUCTION PROJECTS:</span>
1. <span class="text-cyan-400 font-semibold">Custom Print E-Commerce</span>
   └─ VPS CI/CD pipeline, PostgreSQL, Nginx, Gunicorn, Cloudflare
2. <span class="text-cyan-400 font-semibold">Storyframe AI Studio</span>
   └─ 2D character-consistent storyboard generation powered by Gemini API & React
3. <span class="text-cyan-400 font-semibold">Python Automation Suites</span>
   └─ TubTub-Automator, MemAlloc-Core & FleetFlow (MoviePy, FFmpeg, edge-tts)
4. <span class="text-cyan-400 font-semibold">OOP C++ Management System</span>
   └─ Dynamic polymorphism, virtual tables, dynamic memory, binary fstream
5. <span class="text-cyan-400 font-semibold">Interactive Frontend & Liquid Tools</span>
   └─ Color-variation previewer, catalog layouts, marquee tickers for Shopify

<span class="text-slate-400">Type 'open &lt;project-number&gt;' or click the Projects section on the page.</span>
`,

    skills: () => `
<span class="text-indigo-400 font-bold">CORE TECHNICAL ARSENAL:</span>
• <span class="text-yellow-400">Languages:</span> C++, Python, JavaScript (ES6+), PHP, SQL, HTML5/CSS3
• <span class="text-yellow-400">Frontend:</span> React, Next.js, Tailwind CSS, Bootstrap, Shopify Liquid
• <span class="text-yellow-400">Backend & Cloud:</span> Node.js, Express, PostgreSQL, Linux VPS, Nginx, Gunicorn, Cloudflare
• <span class="text-yellow-400">AI & Automation:</span> Google AI Studio, Gemini API, Whisper, edge-tts, MoviePy, FFmpeg, Make.com
• <span class="text-yellow-400">DevOps & Tools:</span> Git, GitHub, Linux Bash, Pandas, openpyxl, CI/CD
`,

    experience: () => `
<span class="text-amber-400 font-bold">CAREER HISTORY:</span>
1. <span class="text-white font-semibold">Chief Technology Officer</span> @ Evoke Perfume
   └─ <span class="text-emerald-400 font-semibold">Nov 2026 — Present (Full-time · On-site, Lahore)</span>
   └─ Leading technology architecture, e-commerce infrastructure, and automated operations.

2. <span class="text-white font-semibold">Digital Growth Specialist</span> @ SYNAPSEBIZ
   └─ <span class="text-slate-400">Apr 2026 — Present · 8 mos (Remote, Islamabad)</span>
   └─ Technical data tracking, process automation, and platform growth architecture.

3. <span class="text-white font-semibold">AI Intern</span> @ SYNAPSEBIZ
   └─ <span class="text-slate-400">Aug 2026 — Oct 2026 · 3 mos (Part-time · Remote)</span>
   └─ Internal AI tooling, Python data pipelines, and LLM automation.

4. <span class="text-white font-semibold">AI/ML Intern</span> @ Digitech Offerings
   └─ <span class="text-slate-400">Apr — Jun 2026 · 3 mos (Remote, Lahore)</span>
   └─ Practical ML implementation, model benchmarking, automated pipelines.
   └─ <a href="https://www.linkedin.com/in/awshameeed/overlay/Position/2889102362/treasury/?profileId=ACoAAF8zfHoBFkYU_GcN7cKk_avSfrzDBu3JSvc" target="_blank" class="text-cyan-400 underline">Certificate of Completion Internship ↗</a>
`,

    education: () => `
<span class="text-blue-400 font-bold">ACADEMIC BACKGROUND:</span>
• <span class="text-white font-semibold">BS Computer Science (BSCS)</span>
  University of Central Punjab, Lahore (Expected 2029)
  Relevant Courses: OOP, Data Structures, Web Development, Database Systems.
  Project Lead: "Beyond the Blindspot" Community Service Project.

• <span class="text-white font-semibold">Aspire College</span> (2023 — 2025)
• <span class="text-white font-semibold">British International School System</span>
`,

    contact: () => `
<span class="text-rose-400 font-bold">GET IN TOUCH:</span>
• <span class="text-slate-200">Email:</span> <a href="mailto:awshameed.dev@gmail.com" class="text-cyan-400 underline">awshameed.dev@gmail.com</a>
• <span class="text-slate-200">GitHub:</span> <a href="https://github.com/L1F25BSCS0511-Aws" target="_blank" class="text-cyan-400 underline">github.com/L1F25BSCS0511-Aws</a>
• <span class="text-slate-200">LinkedIn:</span> <a href="https://www.linkedin.com/in/awshameeed/" target="_blank" class="text-cyan-400 underline">linkedin.com/in/awshameeed</a>
• <span class="text-slate-200">Location:</span> Lahore, Pakistan (PKT / UTC+5)
`,

    resume: () => `
<span class="text-emerald-400 font-bold">RESUME HIGHLIGHTS:</span>
Download official PDF: <a href="https://awshameed.me/resume.pdf" target="_blank" class="text-cyan-400 underline">https://awshameed.me/resume.pdf</a>
Or click the 'Download Resume' button on the hero section.
`,

    sudo: (args) => {
      if (args && args.toLowerCase().includes('hire')) {
        setTimeout(() => {
          if (window.confetti) {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          if (window.soundManager) window.soundManager.success();
        }, 100);
        return `
<div class="text-emerald-400 font-bold text-base">🎉 OUTSTANDING DECISION!</div>
<span class="text-slate-200">Aws Hameed has been notified of your interest. Let's build something phenomenal together!</span>
<div class="mt-2 text-cyan-300">Direct Email: <a href="mailto:awshameed.dev@gmail.com" class="underline">awshameed.dev@gmail.com</a></div>
<div class="text-slate-400 text-xs">Response time: Usually within a few hours.</div>
`;
      }
      return `<span class="text-red-400">Permission denied: try 'sudo hire' ;)</span>`;
    },

    matrix: () => {
      setTimeout(runMatrixEffect, 100);
      return `<span class="text-emerald-400">Initializing Neo matrix stream... (click anywhere in terminal to stop)</span>`;
    },

    clear: () => {
      body.innerHTML = '';
      return null;
    },

    exit: () => {
      closeTerminal();
      return null;
    }
  };

  function runMatrixEffect() {
    const chars = '01AWS_HAMEED_CODE_PYTHON_CPP_AI_SYSTEMS_404_200_OK_';
    let count = 0;
    const interval = setInterval(() => {
      if (count++ > 25) {
        clearInterval(interval);
        return;
      }
      let line = '';
      for (let i = 0; i < 40; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      printOutput(`<span class="text-emerald-500 font-mono text-xs opacity-75">${line}</span>`);
    }, 60);
  }

  function printOutput(html) {
    if (!html) return;
    const div = document.createElement('div');
    div.className = 'mb-2 leading-relaxed';
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function handleCommand(cmdStr) {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    // Echo input
    printOutput(`<div class="flex items-center gap-2 text-slate-300"><span class="text-purple-400 font-bold">visitor@awshameed:~$</span> <span>${escapeHtml(trimmed)}</span></div>`);

    if (window.soundManager) window.soundManager.keystroke();

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    if (commands[cmd]) {
      const res = commands[cmd](args);
      printOutput(res);
    } else {
      printOutput(`<span class="text-red-400">Command not found: '${escapeHtml(cmd)}'. Type <span class="text-cyan-400 font-semibold cursor-pointer underline" onclick="document.getElementById('terminal-input').value='help';document.getElementById('terminal-input').focus();">help</span> for a list of commands.</span>`);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function openTerminal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.soundManager) window.soundManager.open();
    input.focus();
    if (body.children.length === 0) {
      printOutput(`
<div class="text-cyan-400 font-mono text-xs mb-2">
  <pre class="leading-none select-none text-purple-400">
   ___                     __ __                      __ 
  / _ | _    _____        / // /__ ___ _  ___ ___ ___/ / 
 / __ | | |/|/ (_-<      / _  / _ `/  ' \/ -_) -_) _  /  
/_/ |_| |__,__/___/     /_//_/\_,_/_/_/_/\__/\__/\_,_/   
  </pre>
</div>
<div class="text-slate-300 text-xs">Aws Hameed Interactive Developer Terminal v2.4</div>
<div class="text-slate-400 text-xs mb-2">Type <span class="text-yellow-400 font-semibold">help</span> to explore available commands or <span class="text-yellow-400 font-semibold">sudo hire</span> to connect.</div>
<div class="h-px bg-slate-700/60 my-2"></div>
`);
    }
  }

  function closeTerminal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  // Event Listeners
  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  // Keyboard shortcut Ctrl+K or backtick (~)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('hidden')) openTerminal();
      else closeTerminal();
    }
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeTerminal();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex] || '';
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  // Make prompt clickable for suggestions
  window.runCliCommand = function(cmd) {
    if (modal.classList.contains('hidden')) openTerminal();
    input.value = cmd;
    handleCommand(cmd);
  };
})();
