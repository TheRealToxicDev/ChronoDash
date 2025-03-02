import Cookies from "js-cookie";

export const setAuthToken = (token: string) => {
    Cookies.set("token", token, { expires: 1 }); // Expires in 1 day
};

export const setUserRoles = (roles: string[]) => {
    Cookies.set("roles", JSON.stringify(roles), { expires: 1 });
};

export const getAuthToken = () => {
    return Cookies.get("token");
};

export const getUserRoles = (): string[] => {
    const roles = Cookies.get("roles");
    return roles ? JSON.parse(roles) : [];
};

export const isAdmin = (): boolean => {
    const roles = getUserRoles();
    return roles.includes("admin");
};

export const logout = () => {
    Cookies.remove("token");
    Cookies.remove("roles");
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};
