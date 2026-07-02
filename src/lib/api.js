const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    options.credentials = options.credentials || "include";
    
    if (options.body && !(options.body instanceof FormData)) {
        options.headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };
        options.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, options);
    
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }
    
    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed");
    }
    
    return data;
}
