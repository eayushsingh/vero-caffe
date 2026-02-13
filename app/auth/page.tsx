import GoogleLoginButton from "@/components/GoogleLoginButton";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center border border-neutral-100">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Logo size="lg" />
                    </Link>
                </div>

                <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">Welcome Back</h1>
                <p className="text-neutral-500 mb-8 max-w-xs mx-auto">
                    Sign in to access your saved orders and profile.
                </p>

                <div className="flex justify-center w-full">
                    <GoogleLoginButton />
                </div>

                <p className="mt-8 text-xs text-neutral-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
