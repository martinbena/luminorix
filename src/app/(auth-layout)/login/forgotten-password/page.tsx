import { ForgottenPasswordProvider } from "@/app/contexts/ForgottenPasswordContext";
import ForgottenPassword from "@/components/auth/ForgottenPassword";

export default function ForgottenPasswordPage() {
  return (
    <ForgottenPasswordProvider>
      <ForgottenPassword />
    </ForgottenPasswordProvider>
  );
}
