import Link from "next/link";

interface NavigationLinkProps {
  href: string;
  description: string;
}

export default function NavigationLink({
  href,
  description,
}: NavigationLinkProps) {
  return (
    <li className="child:flex child:flex-1 child:py-2.5 child:pl-12">
      <Link href={href}>{description}</Link>
    </li>
  );
}
