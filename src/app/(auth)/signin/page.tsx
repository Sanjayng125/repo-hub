import { signIn } from "@/lib/auth";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Signin = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg p-5 flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-2xl font-semibold border-b-2 w-full pb-3 mb-3">
          Sign In
        </h1>
        <div className="flex items-center gap-2">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirect: true, redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="bg-slate-800 hover:bg-opacity-60 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaGithub className="size-5" /> Sign-in with Github
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
