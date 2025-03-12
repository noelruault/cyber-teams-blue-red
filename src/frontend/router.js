const SERVER = "http://localhost:3000"

import * as ctf1 from "./components/ctf-1.js"
import * as ctf2 from "./components/ctf-2.js"
import * as ctf3 from "./components/ctf-3.js"
import * as ctf4 from "./components/ctf-4.js"
import * as ctf5 from "./components/ctf-5.js"
import * as ctf6 from "./components/ctf-6.js"

const routes = {
    "/": {
        endpoint: "/",
        initialize: () => console.log("Home initialized")
    },
    "/ctf-1": {
        endpoint: "/ctf-1",
        component: "ctf-1.html",
        initialize: () => ctf1.initialize()
    },
    "/ctf-2": {
        endpoint: "/ctf-2",
        component: "ctf-2.html",
        initialize: () => ctf2.initialize()
    },
    "/ctf-3": {
        endpoint: "/ctf-3",
        component: "ctf-3.html",
        initialize: () => ctf3.initialize()
    },
    "/ctf-4": {
        endpoint: "/ctf-4",
        component: "ctf-4.html",
        initialize: () => ctf4.initialize()
    },
    "/ctf-5": {
        endpoint: "/ctf-5",
        component: "ctf-5.html",
        initialize: () => ctf5.initialize()
    },
    "/ctf-6": {
        endpoint: "/ctf-6",
        component: "ctf-6.html",
        initialize: () => ctf6.initialize()
    }
}

async function fetchEndpoint(server, endpoint) {
    try {
        let response
        if (routes[endpoint].component) {
            response = await fetch(`./components/${routes[endpoint].component}`)
        } else {
            response = await fetch(`${server}${endpoint}`)
        }
        if (!response.ok) throw new Error("Failed to fetch content")

        const content = await response.text()
        if (endpoint !== "/" && content.includes("<body>")) {
            // Check if the content is index.html, if so, replace the body content
            throw new Error("Index page found")
        }
        return content
    } catch (error) {
        console.error("Error fetching endpoint:", error)
        return "<h1>Error loading content</h1>"
    }
}

export async function loadComponent(path) {
    const route = routes[path]
    if (!route) {
        document.querySelector("#main-content").innerHTML = "<h1>404 - Not Found</h1>"
        return
    }

    const mainContent = document.querySelector("#main-content")
    try {
        mainContent.innerHTML = await fetchEndpoint(SERVER, route.endpoint)
        if (route.initialize) route.initialize()
    } catch (error) {
        console.error("Error loading content:", error)
        mainContent.innerHTML = "<h1>Error loading content</h1>"
    }
}

// Add this new function to handle all fetch requests
export async function fetchAPI(endpoint, options = {}) {
    const url = `${SERVER}${endpoint}`
    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response
    } catch (error) {
        console.error("API fetch error:", error)
        throw error
    }
}
