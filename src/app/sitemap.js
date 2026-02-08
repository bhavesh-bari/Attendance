export default function sitemap() {
    var domain = process.env.DOMAIN || "https://jspmattendance.vercel.app";
    return [
        {
            url: `${domain}/`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1.0,
        },
        {
            url: `${domain}/auth`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        }
    ];
}
