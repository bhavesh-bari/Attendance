import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (!token) return false;

            const role = token.role;
            const path = req.nextUrl.pathname;

            if (path.startsWith("/classes")) {
                return role === "AMC";
            }

            if (path.startsWith("/attendances")) {
                return role === "AMC" || role === "Department Dean";
            }

            return true;
        },
    },
    pages: {
        signIn: "/auth",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/attendances/:path*",
        "/classes/:path*",
        "/table/:path*",
        "/analytics/:path*",
    ],
};
