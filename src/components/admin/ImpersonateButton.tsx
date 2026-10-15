"use client";

import { useState } from "react";
import { FaUserSecret } from "react-icons/fa";

interface ImpersonateButtonProps {
    userId: string;
    userName: string;
}

export default function ImpersonateButton({ userId, userName }: ImpersonateButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleImpersonate = async () => {
        if (!confirm(`¿Estás seguro que deseas iniciar sesión como ${userName}? Esto cerrará tu sesión actual de administrador.`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: userId })
            });

            if (res.ok) {
                const data = await res.json();
                // Redirigir al dashboard o página correspondiente según el rol
                if (data.role === "CANDIDATE") {
                    window.location.href = "/dashboard";
                } else if (data.role === "DIRECTOR") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || "No se pudo cambiar de usuario"}`);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al intentar cambiar de usuario.");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleImpersonate}
            disabled={loading}
            title={`Iniciar sesión como ${userName}`}
            style={{
                background: "rgba(200, 255, 11, 0.1)",
                border: "1px solid #C8FF0B",
                color: "#C8FF0B",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
                transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C8FF0B";
                e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(200, 255, 11, 0.1)";
                e.currentTarget.style.color = "#C8FF0B";
            }}
        >
            <FaUserSecret />
            {loading ? "..." : "INICIAR COMO"}
        </button>
    );
}
