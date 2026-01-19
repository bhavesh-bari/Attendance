import AuthForm from "@/components/UI/AuthForm";

export const metadata = {
  title: "Authentication | Attendance Monitoring JSPM NTC",
  description: "Login or Sign Up for the JSPM NTC Attendance System",
  icons: {
    icon: "/jspm1.webp",
    shortcut: "/jspm1.webp",
    apple: "/jspm1.webp",
  },
};

export default function AuthPage() {
  return <AuthForm />;
}