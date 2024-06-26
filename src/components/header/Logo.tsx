import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import logo from "/public/images/Logo.png";

export default function Logo() {
  return (
    <div className="tab:justify-self-start">
      <Link href={paths.home()} tabIndex={-1}>
        <Image
          src={logo}
          width={128}
          height={128}
          alt="Logo of Luminorix"
          className="mob:h-24 mob:w-24 mob-sm:h-20 mob-sm:w-20"
          priority
        />
      </Link>
    </div>
  );
}
