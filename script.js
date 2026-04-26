// ========== PROJECT MANAGEMENT ==========
const ADMIN_PASSWORD = 'taikun2024'; // CHANGE THIS AFTER FIRST USE

// Load projects from localStorage
let projects = JSON.parse(localStorage.getItem('taikun_projects')) || [];

// SAMPLE PROJECTS - These are just examples to show you how it works
// YOU CAN DELETE THESE AND ADD YOUR REAL CLIENTS!
// The "example.com" links are placeholders. Replace them with real client sites.
if (projects.length === 0) {
    projects = [
        { 
            id: 1, 
            name: "Sample Client 1 - Replace Me", 
            url: "https://example.com/client1", 
            type: "website", 
            desc: "This is a sample project. Delete this and add your real client!",
            backlinkVerified: true,
            dateAdded: "2024-01-15"
        },
        { 
            id: 2, 
            name: "Sample Client 2 - Replace Me", 
            url: "https://example.com/client2", 
            type: "ai", 
            desc: "This is a sample project. Delete this and add your real client!",
            backlinkVerified: true,
            dateAdded: "2024-02-01"
        },
        { 
            id: 3, 
            name: "Sample Client 3 - Replace Me", 
            url: "https://example.com/client3", 
            type: "social", 
            desc: "This is a sample project. Delete this and add your real client!",
            backlinkVerified: true,
            dateAdded: "2024-02-20"
        }
    ];
    localStorage.setItem('taikun_projects', JSON.stringify(projects));
}

// Display projects on the page
function displayProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    const typeMap = { 
        website: { icon: "fa-globe", label: "🌐 Modern Website" },
        system: { icon: "fa-server", label: "⚙️ Custom System" },
        social: { icon: "fa-chart-line", label: "📱 Social Media" },
        ai: { icon: "fa-robot", label: "🤖 AI Solution" }
    };
    
    // Show all projects (newest first)
    const sortedProjects = [...projects].reverse();
    
    if (sortedProjects.length === 0) {
        grid.innerHTML = `<div style="text-align: center; grid-column: 1/-1; padding: 3rem;">
            <i class="fas fa-folder-open" style="font-size: 3rem; color: #667eea;"></i>
            <h3>No projects yet</h3>
            <p>Use the Admin panel to add your first client project!</p>
        </div>`;
    } else {
        grid.innerHTML = sortedProjects.map(p => `
            <div class="project-card">
                <div class="project-image-placeholder">
                    <i class="fas ${typeMap[p.type]?.icon || 'fa-globe'}"></i>
                </div>
                <h3>${escapeHtml(p.name)}</h3>
                <p>${escapeHtml(p.desc)}</p>
                <div class="project-meta">
                    <span class="project-tag">${typeMap[p.type]?.label || p.type}</span>
                    <a href="${p.url}" target="_blank" class="project-link" onclick="trackBacklinkClick('${p.url}')">
                        Visit Website <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
                <div class="powered-by-badge">
                    <small>🔗 <a href="https://taikuntechnologies.vercel.app" target="_blank">Powered by TAIKUN TECHNOLOGIES</a></small>
                </div>
            </div>
        `).join('');
    }
    
    // Update stats
    const projectCountElem = document.getElementById('projectCount');
    if (projectCountElem) projectCountElem.textContent = projects.length;
    
    const backlinkCount = projects.filter(p => p.backlinkVerified !== false).length;
    const backlinkCountElem = document.getElementById('backlinkCount');
    if (backlinkCountElem) backlinkCountElem.textContent = backlinkCount;
}

// Track clicks on client sites
function trackBacklinkClick(url) {
    console.log(`🔗 Clicked client site: ${url}`);
}

// Helper function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new client project
function addProject(name, url, type, desc) {
    const newProject = {
        id: Date.now(),
        name: name,
        url: url,
        type: type,
        desc: desc,
        backlinkVerified: true,
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    localStorage.setItem('taikun_projects', JSON.stringify(projects));
    displayProjects();
    return true;
}

// ========== CLIENT BADGE GENERATOR ==========
const YOUR_PORTFOLIO_URL = 'https://taikuntechnologies.vercel.app';

function copyBadgeCode() {
    const badgeHtml = `<a href="${YOUR_PORTFOLIO_URL}" target="_blank" style="text-decoration: none; color: #667eea;">Powered by TAIKUN TECHNOLOGIES</a>`;
    
    navigator.clipboard.writeText(badgeHtml).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
        alert('✓ Badge code copied! Send this to your client to put in their website footer.');
    }).catch(() => {
        alert('Copy manually: ' + badgeHtml);
    });
}

const previewLink = document.getElementById('badgePreview');
if (previewLink) {
    previewLink.href = YOUR_PORTFOLIO_URL;
}

// ========== ADMIN PANEL ==========
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

const addProjectForm = document.getElementById('addProjectForm');
if (addProjectForm) {
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('adminPass').value;
        if (password !== ADMIN_PASSWORD) {
            alert('❌ Wrong password!');
            return;
        }
        
        const name = document.getElementById('projectName').value;
        const url = document.getElementById('projectUrl').value;
        const type = document.getElementById('projectType').value;
        const desc = document.getElementById('projectDesc').value;
        
        if (!name || !url || !type) {
            alert('Please fill in all required fields');
            return;
        }
        
        addProject(name, url, type, desc);
        alert(`✅ ${name} added to your portfolio!\n\nNext step: Send them the badge code for their footer.`);
        
        addProjectForm.reset();
        document.getElementById('adminPass').value = '';
        toggleAdminPanel();
    });
}

// ========== DELETE SAMPLE PROJECTS (Run this once to remove examples) ==========
// To remove the sample projects and start fresh, uncomment this code and refresh the page:
/*
function deleteAllSampleProjects() {
    const password = prompt("Enter admin password to delete all sample projects:");
    if (password === ADMIN_PASSWORD) {
        const realProjects = projects.filter(p => !p.url.includes('example.com'));
        if (realProjects.length === 0) {
            localStorage.removeItem('taikun_projects');
            projects = [];
        } else {
            localStorage.setItem('taikun_projects', JSON.stringify(realProjects));
            projects = realProjects;
        }
        displayProjects();
        alert("Sample projects removed! Now add your real clients.");
    }
}
// Call deleteAllSampleProjects() in console if you want to remove examples
*/

// ========== AI CHAT ==========
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
    showTypingIndicator();
    
    setTimeout(() => {
        let response = '';
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('website') || lowerMsg.includes('web')) {
            response = "We build modern, responsive websites using React and Next.js. Check out our portfolio to see examples! Contact us for a quote.";
        }
        else if (lowerMsg.includes('social media')) {
            response = "Our social media management includes content creation, daily posting, analytics, and engagement. Packages start at $999/month.";
        }
        else if (lowerMsg.includes('ai') || lowerMsg.includes('artificial')) {
            response = "We create custom AI solutions - chatbots, automation, predictive analytics. Tell me about your business needs!";
        }
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('quote')) {
            response = "Website: $2,500-7,500 | AI solutions: $3,000+ | Social media: $999/month. Free consultation available!";
        }
        else if (lowerMsg.includes('portfolio') || lowerMsg.includes('project')) {
            response = `We've built ${projects.length} projects so far! Check out our portfolio section to see real client websites.`;
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
            response = "You can reach us at brianmatundla@gmail.com or call +254 758 570 579. We respond within 24 hours!";
        }
        else {
            response = `Thanks for reaching out! TAIKUN TECHNOLOGIES specializes in modern websites, custom systems, social media, and AI solutions. Email brianmatundla@gmail.com or call +254 758 570 579 to get started!`;
        }
        
        removeTypingIndicator();
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

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message ai-message typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = '<i class="fas fa-ellipsis-h"></i> TAIKUN AI is thinking...';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ========== CONTACT FORM (Working with Formspree) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const statusDiv = document.getElementById('formStatus');
        statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
        statusDiv.style.color = '#667eea';
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> ✓ Message sent! We\'ll respond within 24 hours.';
                statusDiv.style.color = '#4ade80';
                contactForm.reset();
                setTimeout(() => statusDiv.innerHTML = '', 5000);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ⚠️ Error sending message. Please email brianmatundla@gmail.com directly.';
            statusDiv.style.color = '#ef4444';
            setTimeout(() => statusDiv.innerHTML = '', 6000);
        }
    });
}

// ========== MOBILE MENU & SCROLL ==========
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = '#0a0a0a';
            navLinks.style.padding = '1rem';
            navLinks.style.gap = '1rem';
            navLinks.style.zIndex = '999';
        }
    });
}

window.onclick = (event) => {
    const modal = document.getElementById('aiChatModal');
    if (event.target === modal) closeAIChat();
};

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.style = '';
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize
displayProjects();
console.log('TAIKUN TECHNOLOGIES Portfolio Active!');
console.log('To remove sample projects, open browser console (F12) and type: deleteAllSampleProjects()');