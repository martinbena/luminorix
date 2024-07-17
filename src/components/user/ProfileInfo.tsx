import Image from "next/image";
import { HiUser } from "react-icons/hi";
import Button from "../ui/Button";
import paths from "@/lib/paths";
import { User } from "@/models/User";

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const isGoogleUser = user.email.includes("@gmail.com");

  return (
    <div className="flex gap-12 mob-sm:flex-col mob-sm:items-center mob-sm:gap-6 mob-sm:text-center">
      <div
        className={` w-48 h-48 mob:w-40 mob:h-40 ${
          user.image
            ? "aspect-square relative"
            : "rounded-full border border-zinc-200 flex justify-center items-center"
        }`}
      >
        {user?.image ? (
          <Image
            src={user?.image}
            alt={`Image of ${user?.name}`}
            fill
            sizes="50vw"
            className="object-cover rounded-full"
          />
        ) : (
          <HiUser className="w-32 h-32 mob:w-7 mob:h-7 text-zinc-600" />
        )}
      </div>
      <div
        className={`flex flex-col  ${
          isGoogleUser ? "justify-center" : "justify-between"
        } py-4`}
      >
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-3xl mob:text-2xl">{user.name}</h2>
          <p className="font-medium text-base mob:text-sm">{user.email}</p>
        </div>

        {isGoogleUser ? (
          <span>&nbsp;</span>
        ) : (
          <Button type="secondary" href={paths.userSettings()}>
            Update
          </Button>
        )}
      </div>
    </div>
  );
}
