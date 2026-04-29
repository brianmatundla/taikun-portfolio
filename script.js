const ADMIN_PASSWORD = 'taikun2024';

let projects = JSON.parse(localStorage.getItem('taikun_projects')) || [];

function saveProjects() {
    localStorage.setItem('taikun_projects', JSON.stringify(projects));
    displayProjects();
}

function displayProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    const typeMap = {
        website: { icon: "fa-globe", label: "🌐 Website" },
        system: { icon: "fa-server", label: "⚙️ System" },
        social: { icon: "fa-chart-line", label: "📱 Social Media" },
        ai: { icon: "fa-robot", label: "🤖 AI Solution" }
    };
    
    if (projects.length === 0) {
        grid.innerHTML = `<div style="text-align: center; grid-column: 1/-1; padding: 3rem;">
            <i class="fas fa-folder-open" style="font-size: 3rem; color: #667eea;"></i>
            <h3>No projects yet</h3>
            <p>Use the Admin Dashboard to add your first project.</p>
        </div>`;
    } else {
        grid.innerHTML = projects.slice().reverse().map(p => `
            <div class="project-card">
                <div class="project-image-placeholder">
                    <i class="fas ${typeMap[p.type]?.icon || 'fa-globe'}"></i>
                </div>
                <h3>${escapeHtml(p.name)}</h3>
                <p>${escapeHtml(p.desc)}</p>
                <div class="project-meta">
                    <span class="project-tag">${typeMap[p.type]?.label || p.type}</span>
                    <a href="${p.url}" target="_blank" class="project-link">Visit Site <i class="fas fa-external-link-alt"></i></a>
                </div>
                <div class="powered-by-badge">
                    <small>🔗 Powered by TAIKUN TECHNOLOGIES</small>
                </div>
            </div>
        `).join('');
    }
    
    const countElem = document.getElementById('projectCount');
    if (countElem) countElem.textContent = projects.length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('addProjectForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('adminPass').value;
    if (password !== ADMIN_PASSWORD) {
        alert('Invalid password');
        return;
    }
    
    const name = document.getElementById('projectName').value;
    const url = document.getElementById('projectUrl').value;
    const type = document.getElementById('projectType').value;
    const desc = document.getElementById('projectDesc').value;
    
    if (!name || !url || !type || !desc) {
        alert('Please fill all fields');
        return;
    }
    
    projects.push({
        id: Date.now(),
        name: name,
        url: url,
        type: type,
        desc: desc,
        date: new Date().toISOString().split('T')[0]
    });
    
    saveProjects();
    alert('Project added successfully!');
    e.target.reset();
    document.getElementById('adminPass').value = '';
    toggleAdminPanel();
});

function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function openAIChat() {
    document.getElementById('aiChatModal').style.display = 'block';
}

function closeAIChat() {
    document.getElementById('aiChatModal').style.display = 'none';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    showTyping();
    
    setTimeout(() => {
        let response = '';
        const m = message.toLowerCase();
        
        if (m.includes('website')) {
            response = "We build modern, responsive websites using React and Next.js. Pricing starts at $2,500. Would you like a custom quote?";
        } else if (m.includes('social')) {
            response = "Our social media management includes content creation, daily posting, and analytics. Packages start at $999/month.";
        } else if (m.includes('ai')) {
            response = "We create custom AI solutions including chatbots, automation, and predictive analytics. Tell me about your needs!";
        } else if (m.includes('price') || m.includes('cost')) {
            response = "Websites: $2,500-7,500 | AI solutions: $3,000+ | Social media: $999/month. Free consultation available!";
        } else if (m.includes('contact') || m.includes('email')) {
            response = "You can reach us at brianmatundla@gmail.com or call +254 758 570 579. We respond within 24 hours.";
        } else {
            response = "Thank you for your interest. TAIKUN TECHNOLOGIES specializes in websites, custom systems, social media management, and AI solutions. How can I help you today?";
        }
        
        removeTyping();
        addMessage(response, 'ai');
    }, 600);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.id = 'typingIndicator';
    div.innerHTML = '<i class="fas fa-ellipsis-h"></i> Typing...';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        const res = await fetch(e.target.action, {
            method: 'POST',
            body: new FormData(e.target),
            headers: { 'Accept': 'application/json' }
        });
        
        if (res.ok) {
            status.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! We\'ll respond within 24 hours.';
            status.style.color = '#4ade80';
            e.target.reset();
            setTimeout(() => status.innerHTML = '', 5000);
        } else {
            throw new Error();
        }
    } catch(err) {
        status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending. Please email brianmatundla@gmail.com';
        status.style.color = '#ef4444';
    }
});

const mobileBtn = document.querySelector('.mobile-menu-btn');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        const links = document.querySelector('.nav-links');
        if (links.style.display === 'flex') {
            links.style.display = 'none';
        } else {
            links.style.display = 'flex';
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '70px';
            links.style.left = '0';
            links.style.right = '0';
            links.style.background = '#0a0a0a';
            links.style.padding = '1rem';
            links.style.zIndex = '999';
        }
    });
}

window.onclick = (e) => {
    const modal = document.getElementById('aiChatModal');
    if (e.target === modal) closeAIChat();
};

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-links').style = '';
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const top = section.offsetTop;
        if (scrollY >= top - 200) current = section.getAttribute('id');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

displayProjects();