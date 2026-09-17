"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const returnTo = searchParams.get("returnTo")?.startsWith("/admin") ? searchParams.get("returnTo")! : "/admin";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setState("error");
      return;
    }

    setState("submitting");
    const { error } = await authClient.signIn.email({ email, password, callbackURL: returnTo });
    if (error) {
      setState("error");
      return;
    }

    router.replace(returnTo);
    router.refresh();
  }

  return <main className="admin-login"><div className="admin-login__brand"><span>✦</span><b>STAR</b> ENERGIES <small>ADMINISTRATION</small></div><section><p>SECURE ACCESS</p><h1>Website administration</h1><span>Use the administrator account created during secure backend setup.</span><form onSubmit={submit}><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setState("idle"); }} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setState("idle"); }} required /></label>{state === "error" && <div role="alert">Invalid email or password. Please try again.</div>}<button type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Signing in…" : "Sign in"}</button></form></section><footer>STAR ENERGIES · WANI, MAHARASHTRA</footer></main>;
}
