// Project Data
const projects = [
    {
        title: "E-Commerce Platform",
        category: "Full Stack",
        description: "A complete e-commerce solution with product catalog, shopping cart, checkout, and admin dashboard. Built with React, Node.js, MongoDB, and Stripe integration.",
        tech: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Tailwind"],
        github: "https://github.com/imahmedsohail/ecommerce-platform",
        demo: "https://ecommerce-demo.vercel.app",
        icon: "🛒"
    },
    {
        title: "Task Management App",
        category: "Full Stack",
        description: "A collaborative task management tool with real-time updates, team workspaces, and drag-and-drop kanban boards. Features user authentication and role-based access control.",
        tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Socket.io", "Docker"],
        github: "https://github.com/imahmedsohail/task-manager",
        demo: "https://task-manager.vercel.app",
        icon: "📋"
    },
    {
        title: "Weather Dashboard",
        category: "Frontend",
        description: "An interactive weather visualization dashboard with location search, detailed forecasts, and animated weather icons. Uses OpenWeather API and D3.js for charts.",
        tech: ["React", "D3.js", "OpenWeather API", "Tailwind", "Vite"],
        github: "https://github.com/imahmedsohail/weather-dashboard",
        demo: "https://weather-dashboard.vercel.app",
        icon: "☀️"
    },
    {
        title: "Real-time Chat App",
        category: "Full Stack",
        description: "A modern chat application with private rooms, file sharing, and end-to-end encryption. Built with WebSockets for real-time communication.",
        tech: ["React", "Node.js", "Socket.io", "MongoDB", "JWT", "WebRTC"],
        github: "https://github.com/imahmedsohail/chat-app",
        demo: "https://chat-app.vercel.app",
        icon: "💬"
    },
    {
        title: "Portfolio Generator CLI",
        category: "Backend",
        description: "A command-line tool that generates beautiful portfolio websites from a simple JSON configuration. Supports multiple themes and custom templates.",
        tech: ["Node.js", "TypeScript", "EJS", "Commander.js", "Inquirer"],
        github: "https://github.com/imahmedsohail/portfolio-generator",
        demo: "https://github.com/imahmedsohail/portfolio-generator",
        icon: "🛠️"
    },
    {
        title: "API Documentation Tool",
        category: "Full Stack",
        description: "An interactive API documentation platform with live testing, code examples, and authentication playground. Supports OpenAPI and GraphQL.",
        tech: ["React", "Node.js", "OpenAPI", "GraphQL", "Express", "Swagger"],
        github: "https://github.com/imahmedsohail/api-docs",
        demo: "https://api-docs.vercel.app",
        icon: "📚"
    },
    {
        title: "Fitness Tracker App",
        category: "Frontend",
        description: "A fitness tracking application with workout logging, progress charts, and personalized recommendations. Uses localStorage for data persistence.",
        tech: ["React", "TypeScript", "Chart.js", "Tailwind", "Vite"],
        github: "https://github.com/imahmedsohail/fitness-tracker",
        demo: "https://fitness-tracker.vercel.app",
        icon: "🏋️"
    },
    {
        title: "Blog Platform",
        category: "Full Stack",
        description: "A complete blog platform with Markdown support, comments, and user authentication. Features SEO optimization and RSS feeds.",
        tech: ["Next.js", "MongoDB", "Markdown", "Prisma", "NextAuth", "Tailwind"],
        github: "https://github.com/imahmedsohail/blog-platform",
        demo: "https://blog-platform.vercel.app",
        icon: "✍️"
    },
    {
        title: "Stock Market Dashboard",
        category: "Frontend",
        description: "A real-time stock market dashboard with interactive charts, portfolio tracking, and news integration. Uses Alpha Vantage API.",
        tech: ["React", "D3.js", "Alpha Vantage API", "Tailwind", "Vite"],
        github: "https://github.com/imahmedsohail/stock-dashboard",
        demo: "https://stock-dashboard.vercel.app",
        icon: "📈"
    },
    {
        title: "Recipe Finder App",
        category: "Frontend",
        description: "A recipe search application with ingredient filtering, meal planning, and grocery list generation. Uses Spoonacular API.",
        tech: ["React", "Spoonacular API", "Tailwind", "Vite", "LocalStorage"],
        github: "https://github.com/imahmedsohail/recipe-finder",
        demo: "https://recipe-finder.vercel.app",
        icon: "🍳"
    },
    {
        title: "URL Shortener Service",
        category: "Backend",
        description: "A URL shortening service with analytics, custom aliases, and expiration dates. Built with Node.js and Redis for fast lookups.",
        tech: ["Node.js", "Express", "Redis", "MongoDB", "JWT", "Docker"],
        github: "https://github.com/imahmedsohail/url-shortener",
        demo: "https://url-shortener.vercel.app",
        icon: "🔗"
    },
    {
        title: "Movie Database App",
        category: "Frontend",
        description: "A movie database application with search, filtering, and watchlist functionality. Uses TMDB API and features infinite scroll.",
        tech: ["React", "TMDB API", "Tailwind", "Vite", "LocalStorage"],
        github: "https://github.com/imahmedsohail/movie-database",
        demo: "https://movie-database.vercel.app",
        icon: "🎬"
    },
    {
        title: "Expense Tracker",
        category: "Full Stack",
        description: "A personal finance application with expense tracking, budgeting, and financial reports. Features data export and multi-currency support.",
        tech: ["React", "Node.js", "MongoDB", "Express", "Chart.js", "JWT"],
        github: "https://github.com/imahmedsohail/expense-tracker",
        demo: "https://expense-tracker.vercel.app",
        icon: "💰"
    },
    {
        title: "Job Board Platform",
        category: "Full Stack",
        description: "A job board platform with company profiles, job listings, and application management. Features search, filtering, and user dashboards.",
        tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "Tailwind"],
        github: "https://github.com/imahmedsohail/job-board",
        demo: "https://job-board.vercel.app",
        icon: "💼"
    },
    {
        title: "Social Media Dashboard",
        category: "Frontend",
        description: "A social media analytics dashboard with data visualization, engagement metrics, and post scheduling. Uses mock data for demonstration.",
        tech: ["React", "D3.js", "Chart.js", "Tailwind", "Vite"],
        github: "https://github.com/imahmedsohail/social-dashboard",
        demo: "https://social-dashboard.vercel.app",
        icon: "📊"
    }
];

let showingAll = false;
const INITIAL_DISPLAY_COUNT = 3;

// Render projects to the grid
function renderProjects(projectsToRender, animate = false) {
    const projectsGrid = document.getElementById('projects-grid');

    projectsToRender.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        if (animate) {
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(30px)';
        }

        projectCard.innerHTML = `
            <div class="project-image">
                <span style="font-size: 64px;">${project.icon}</span>
            </div>
            <div class="project-content">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        <span>GitHub</span>
                    </a>
                    <a href="${project.demo}" target="_blank" class="project-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9V3"/></svg>
                        <span>Live Demo</span>
                    </a>
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);

        // Animate in if requested
        if (animate) {
            setTimeout(() => {
                projectCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

// Initialize projects display
document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const viewAllBtn = document.getElementById('view-all-projects');

    if (projectsGrid) {
        // Initially show only first 3 projects
        renderProjects(projects.slice(0, INITIAL_DISPLAY_COUNT));
    }

    // View All button handler
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            if (!showingAll) {
                // Show remaining projects with animation
                const remainingProjects = projects.slice(INITIAL_DISPLAY_COUNT);
                renderProjects(remainingProjects, true);

                // Update button
                viewAllBtn.querySelector('span').textContent = 'Show Less';
                viewAllBtn.querySelector('svg path').setAttribute('d', 'M5 15l7-7 7 7');
                showingAll = true;
            } else {
                // Hide extra projects with animation
                const allCards = projectsGrid.querySelectorAll('.project-card');
                const cardsToRemove = Array.from(allCards).slice(INITIAL_DISPLAY_COUNT);

                cardsToRemove.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';

                        setTimeout(() => {
                            card.remove();
                        }, 300);
                    }, index * 50);
                });

                // Update button
                viewAllBtn.querySelector('span').textContent = 'View All Projects';
                viewAllBtn.querySelector('svg path').setAttribute('d', 'M19 9l-7 7-7-7');
                showingAll = false;
            }
        });
    }
});