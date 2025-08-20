import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | FTFL Landing",
  description: "This is Next.js SignUp Page FTFL Landing",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
