"use client";

interface DeleteCandidateButtonProps {
    candidateId: string;
    actionBtnStyle: any;
}

export default function DeleteCandidateButton({ candidateId, actionBtnStyle }: DeleteCandidateButtonProps) {
    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm("¿ESTÁS TOTALMENTE SEGURO? Esta acción eliminará permanentemente a la candidata, sus fotos, misiones y cuenta de usuario.")) {
            e.preventDefault();
        }
    };

    return (
        <form action={`/api/admin/candidate/${candidateId}/delete`} method="POST" onSubmit={handleDelete}>
            <button style={actionBtnStyle} title="ELIMINAR PERMANENTEMENTE">🗑️</button>
        </form>
    );
}
