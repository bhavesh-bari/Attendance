import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (!token) return false;

            const role = token.role;
            const path = req.nextUrl.pathname;

            if (path.startsWith("/edit")) {
                return role === "AMC";
            }

            if (path.startsWith("/fill")) {
                return role === "AMC" || role === "Department Dean";
            }

            return true;
        },
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/fill/:path*",
        "/edit/:path*",
        "/table/:path*",
        "/analytics/:path*",
    ],
};
