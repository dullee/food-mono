import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserIcon } from "lucide-react";

type ProfileProps = {
  user: UserProfile;
};

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfileButton({ user }: ProfileProps) {
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: "POST",
        credentials: "include", // required so the browser sends the httpOnly cookie to clear
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Hard refresh and navigate to home page
      window.location.href = "/";
    }
  };
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="w-9 h-9 bg-[#EF4444] rounded-full flex text-white justify-center items-center">
            <UserIcon size={16} />
          </Button>
        }
      />
      <PopoverContent className={"flex flex-col items-center p-4 w-full"}>
        <h1 className="font-bold text-[20px]">{user.email}</h1>
        <Button variant={"ghost"} onClick={handleLogout}>
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
