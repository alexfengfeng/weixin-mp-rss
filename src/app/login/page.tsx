"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.message || "登录失败");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="login">
      <form className="panel" onSubmit={submit}>
        <h1>登录 WeDraft</h1>
        <p className="muted">默认账号由 init-admin 脚本创建。</p>
        <div className="grid">
          <label>用户名<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
          <label>密码<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}
          <button type="submit">登录</button>
        </div>
      </form>
    </div>
  );
}
