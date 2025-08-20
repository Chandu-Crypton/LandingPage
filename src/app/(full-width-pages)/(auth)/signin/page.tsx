import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | FTFL Landing",
  description: "This is Next.js Signin Page FTFL Landing",
};

export default function SignIn() {
  return <SignInForm />;
}
