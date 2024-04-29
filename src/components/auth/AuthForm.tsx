import { ReactNode } from "react";
import FormButton from "../FormButton";
import GoogleLoginButton from "./GoogleLoginButton";

interface AuthFormProps {
  formAction: (payload: FormData) => void; 
  children: ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
  type: "register" | "login";
}

export default function AuthForm({
  formAction,
  children,
  type,
  formRef = null,
}: AuthFormProps) {
  return (
    <div className="flex flex-col gap-8 divide-y-2 mt-12">
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-8 font-sans"
      >
        {children}        
        <div className="mt-6 child:w-full">
          <FormButton>{type}</FormButton>
        </div>
      </form>

      <GoogleLoginButton />
    </div>
  );
}
