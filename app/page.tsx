import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Log in",
};

export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            Sign In With
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/wizard" });
            }}
          >
            <Button type="submit" className="w-full cursor-pointer">
              <SiGoogle /> Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
