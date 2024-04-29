import * as actions from "@/actions";
import Image from "next/image";
import GoogleLogo from "/public/images/google-logo.png";

export default function GoogleLoginButton() {
  return (
    <form className="pt-6" action={actions.signInWithGoogle}>
      <button
        className="py-2 px-8 bg-amber-200 hover:bg-amber-300 transition-colors duration-300 ease-out rounded-full max-w-full flex items-center gap-3 font-sans uppercase justify-center"
        type="submit"
      >
        <Image src={GoogleLogo} alt="Logo of Google" width={32} height={32} />
        Login with Google
      </button>
    </form>
  );
}
