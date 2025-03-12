import { loadComponent } from "./router.js"

class App {
    async initialize() {
        try {
            // Load initial route
            await this.navigate(window.location.pathname)

            // Handle browser back/forward
            window.addEventListener("popstate", () => {
                this.navigate(window.location.pathname)
            })

        } catch (error) {
            console.error("App initialization failed:", error)
        }
    }

    async navigate(path) {
        // Only update history if it's a navigation event
        if (path !== window.location.pathname) {
            history.pushState(null, null, path)
        }
        await loadComponent(path)
    }
}

// Initialize app only once
const app = new App()
document.addEventListener("DOMContentLoaded", () => {
    app.initialize()
})
