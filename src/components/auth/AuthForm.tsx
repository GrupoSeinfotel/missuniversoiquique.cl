"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword) {
            setError("Por favor completa todos los campos.");
            return;
        }

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
            console.log(`Attempting ${isLogin ? 'login' : 'signup'} for:`, cleanEmail);

            const res = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
                headers: { "Content-Type": "application/json" }
            });

            const contentType = res.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                const data = await res.json();
                if (res.ok) {
                    console.log("Auth success!");
                    window.location.href = "/dashboard";
                } else {
                    console.warn("Auth failed:", data.error);
                    setError(data.error || "Credenciales incorrectas");
                }
            } else {
                const text = await res.text();
                console.error("Non-JSON Response:", text);
                setError(`Error del servidor (${res.status}).`)
            }
        } catch (err: any) {
            console.error("Network/Auth error:", err);
            setError("Error de conexión. Intenta de nuevo.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", background: "var(--secondary-bg)", padding: "40px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", textTransform: "uppercase" }}>
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>

            {error && <div style={{ color: "var(--accent-pink)", marginBottom: "20px", textAlign: "center", fontSize: "14px" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                    {isLogin ? "INGRESAR" : "REGISTRARME"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "var(--text-gray)" }}>
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} {" "}
                <span
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ color: "var(--accent-pink)", cursor: "pointer", fontWeight: "bold" }}
                >
                    {isLogin ? "Regístrate" : "Inicia Sesión"}
                </span>
            </p>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "15px",
    background: "var(--primary-bg)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none"
};
