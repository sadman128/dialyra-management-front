import { redirect } from "next/navigation";

export default function OtpRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return redirect("/verify-otp");
}
