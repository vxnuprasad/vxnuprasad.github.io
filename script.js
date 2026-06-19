// ==========================================
// TERMINAL SYSTEM — CYBERSECURITY CHALLENGE
// ==========================================

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

// Story progress flags
let hasScanned = false;
let hasDecrypted = false;

// Command history
let cmdHistory = [];
let historyIndex = -1;

// Correct hash (hex for: linkedin.com/in/vxnuprasad)
const CORRECT_HASH = "6c696e6b6564696e2e636f6d2f696e2f76786e75707261736164";
const OPERATOR_IP  = "10.10.8.7";

function hexDecode(hex) {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

// ==========================================
// OUTPUT HELPERS
// ==========================================

function addOutput(html) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function ok(text) {
    addOutput(`<span style="color:#4ade80">[ OK ]</span> ${text}`);
}

function info(text) {
    addOutput(`<span style="color:#5b82ff">[ INFO ]</span> ${text}`);
}

function warn(text) {
    addOutput(`<span style="color:#facc15">[ WARN ]</span> ${text}`);
}

function err(text) {
    addOutput(`<span style="color:#f87171">[ ERROR ]</span> ${text}`);
}

function blank() {
    addOutput("<br/>");
}

function link(url, label) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#5b82ff;text-decoration:underline;">${label || url}</a>`;
}

// ==========================================
// CLIPBOARD HELPER
// ==========================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        blank();
        ok("Copied to clipboard");
        blank();
    }).catch(() => {
        blank();
        err("Clipboard copy failed. Please copy manually.");
        blank();
    });
}

function copyBtn(text, label) {
    const id = "btn-" + Math.random().toString(36).slice(2, 8);
    // Render inline button; attach listener after inserting
    const html = `<button id="${id}" class="terminal-copy-btn"><i class="fa-solid fa-copy"></i> ${label}</button>`;
    addOutput(html);
    // Attach after DOM insert
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", () => copyToClipboard(text));
    }, 0);
}

// ==========================================
// COMMAND DEFINITIONS
// ==========================================

function cmdHelp() {
    addOutput(`<span style="color:#6ee7b7;font-weight:600;">Available Commands</span>`);
    blank();
    const rows = [
        ["help",            "Show command list"],
        ["whoami",          "Identify current operator"],
        ["scan &lt;ip&gt;", "Scan target host"],
        ["decrypt &lt;hash&gt;", "Decrypt captured payload"],
        ["connect",         "Open discovered endpoint"]
    ];
    rows.forEach(([cmd, desc]) => {
        addOutput(`<span style="color:#5b82ff">${cmd.padEnd(22, "\u00A0")}</span> → ${desc}`);
    });
    blank();
    info("Hint: help → whoami → scan 10.10.8.24 → decrypt &lt;hash&gt; → connect");
}

function cmdWhoami() {
    ok("Identity resolved");
    blank();
    addOutput(`<span style="color:#6ee7b7;font-weight:600;">OPERATOR PROFILE</span>`);
    addOutput(`Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Vishnu Prasad`);
    addOutput(`Alias&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: vxnu`);
    addOutput(`Role&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Cybersecurity Researcher`);
    addOutput(`Company&nbsp;&nbsp;&nbsp;: GreyNod Labs`);
    blank();
    addOutput(`Operator IP:`);
    addOutput(`<span style="color:#facc15">${OPERATOR_IP}</span>`);
    copyBtn(OPERATOR_IP, "Copy IP");
    blank();
    addOutput(`Target identified:`);
    addOutput(`<span style="color:#f87171">10.10.8.24</span>`);
    blank();
    addOutput(`Run:`);
    addOutput(`<span style="color:#5b82ff">scan 10.10.8.24</span>`);
}

function cmdScan(target) {
    if (!target) {
        err("Missing target");
        blank();
        addOutput(`Usage:`);
        addOutput(`<span style="color:#5b82ff">scan &lt;ip&gt;</span>`);
        return;
    }

    ok(`Initiating scan on ${target}...`);
    blank();
    addOutput(`PORT&nbsp;&nbsp;&nbsp;&nbsp;STATE&nbsp;&nbsp;&nbsp;SERVICE`);
    addOutput(`22&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;ssh`);
    addOutput(`80&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;http`);
    addOutput(`443&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;https`);
    blank();
    warn("Encoded payload detected");
    blank();
    addOutput(`Hash:`);
    addOutput(`<span style="color:#facc15">${CORRECT_HASH}</span>`);
    copyBtn(CORRECT_HASH, "Copy Hash");
    blank();
    addOutput(`Run:`);
    addOutput(`<span style="color:#5b82ff">decrypt ${CORRECT_HASH}</span>`);
    hasScanned = true;
}

function cmdDecrypt(hash) {
    if (!hash) {
        err("Missing hash");
        blank();
        addOutput(`Usage:`);
        addOutput(`<span style="color:#5b82ff">decrypt &lt;hash&gt;</span>`);
        return;
    }

    if (hash !== CORRECT_HASH) {
        err("Invalid hash. Decryption failed.");
        info("Run 'scan 10.10.8.24' to intercept the correct payload.");
        return;
    }

    ok("Decrypting payload...");
    blank();
    addOutput(`Decoded Endpoint:`);
    blank();
    addOutput(`<span style="color:#4ade80">${hexDecode(CORRECT_HASH)}</span>`);
    blank();
    addOutput(`Run:`);
    addOutput(`<span style="color:#5b82ff">connect</span>`);
    hasDecrypted = true;
}

function cmdConnect() {
    if (!hasDecrypted) {
        err("No endpoint resolved.");
        info("Run 'decrypt &lt;hash&gt;' first to reveal the endpoint.");
        return;
    }

    const endpoint = hexDecode(CORRECT_HASH);
    ok("Establishing connection...");
    blank();
    addOutput("[####################] 100%");
    blank();
    addOutput(`<span style="color:#4ade80">Connection established.</span>`);
    blank();
    addOutput(`Opening:`);
    addOutput(link("https://www.linkedin.com/in/vxnuprasad/", endpoint));
    window.open("https://www.linkedin.com/in/vxnuprasad/", "_blank");
}

// ==========================================
// COMMAND ROUTER
// ==========================================

function runCommand(rawCommand) {
    const cmd   = rawCommand.trim();
    const lower = cmd.toLowerCase();
    const parts = cmd.split(/\s+/);

    addOutput(`
        <div class="command-line">
            <span class="prompt">root@vxnu:~$</span> ${cmd}
        </div>
    `);

    if (lower === "help")    return cmdHelp();
    if (lower === "whoami")  return cmdWhoami();
    if (lower === "connect") return cmdConnect();

    if (lower === "scan") return cmdScan(null);
    if (lower.startsWith("scan ")) {
        return cmdScan(parts.slice(1).join(" "));
    }

    if (lower === "decrypt") return cmdDecrypt(null);
    if (lower.startsWith("decrypt ")) {
        return cmdDecrypt(parts.slice(1).join(" "));
    }

    err(`Command not found: ${cmd}`);
    info("Type 'help' to view available commands.");
}

// ==========================================
// INPUT HANDLING — ENTER + HISTORY
// ==========================================

if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
        // Task 7: ignore if a form field has focus (shouldn't happen, but safety net)
        const active = document.activeElement;
        if (active && active !== terminalInput) {
            const tag = active.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || active.isContentEditable) return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            const command = terminalInput.value;

            if (command.trim() !== "") {
                runCommand(command);
                cmdHistory.push(command);
                historyIndex = cmdHistory.length;
            }

            terminalInput.value = "";
            return;
        }

        if (e.key === "ArrowUp") {
            if (cmdHistory.length === 0) return;
            e.preventDefault();
            historyIndex = Math.max(0, historyIndex - 1);
            terminalInput.value = cmdHistory[historyIndex] || "";
            return;
        }

        if (e.key === "ArrowDown") {
            if (cmdHistory.length === 0) return;
            e.preventDefault();
            historyIndex = Math.min(cmdHistory.length, historyIndex + 1);
            terminalInput.value = cmdHistory[historyIndex] || "";
            return;
        }
    });

    // TERMINAL AUTO FOCUS
    document.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        if (e.target.closest(".terminal-copy-btn")) return;
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
        if (e.target.isContentEditable) return;
        if (e.target.closest("form")) return;
        terminalInput.focus();
    });
}

// ==========================================
// ACTIVE NAV LINK
// ==========================================

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(navLink => {
    navLink.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"));
        navLink.classList.add("active");
    });
});

// ==========================================
// SIMPLE REVEAL ANIMATION
// ==========================================

const revealElements = document.querySelectorAll(
    ".stat-card, .dashboard-card, .project-card, .blog-card, .cert-box, .client-card, .roadmap-item"
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.1 });

revealElements.forEach((element) => observer.observe(element));

// ==========================================
// ROADMAP CONNECTING LINE GROWTH (about.html)
// ==========================================

const roadmap = document.querySelector(".roadmap");

if (roadmap) {
    const roadmapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                roadmap.classList.add("line-grown");
            }
        });
    }, { threshold: 0.15 });

    roadmapObserver.observe(roadmap);
}

// ==========================================
// CONTACT FORM — FORMSPREE AJAX SUBMISSION
// ==========================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const formStatusMessage = document.getElementById("form-status-message");
    const sendButton = contactForm.querySelector(".send-btn");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        sendButton.disabled = true;

        if (formStatusMessage) {
            formStatusMessage.textContent = "";
            formStatusMessage.className = "";
        }

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })
            .then((response) => {
                if (response.ok) {
                    if (formStatusMessage) {
                        formStatusMessage.textContent = "Message sent successfully. I'll get back to you soon.";
                        formStatusMessage.className = "form-success-message";
                    }
                    contactForm.reset();
                } else {
                    if (formStatusMessage) {
                        formStatusMessage.textContent = "Something went wrong. Please try again.";
                        formStatusMessage.className = "form-error-message";
                    }
                }
            })
            .catch(() => {
                if (formStatusMessage) {
                    formStatusMessage.textContent = "Something went wrong. Please try again.";
                    formStatusMessage.className = "form-error-message";
                }
            })
            .finally(() => {
                sendButton.disabled = false;
            });
    });
}
