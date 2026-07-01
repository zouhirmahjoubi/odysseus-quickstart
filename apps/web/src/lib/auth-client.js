import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "/hcgi/api";
    if (apiUrl.startsWith("/")) {
        return window.location.origin + apiUrl;
    }
    return apiUrl;
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    basePath: "/auth"
});
