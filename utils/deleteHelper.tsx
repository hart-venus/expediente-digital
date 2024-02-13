import { useRouter } from "next/navigation";

export async function deleteHelper(id : string) : Promise<boolean> {
    
    if (!confirm("¿Estás seguro que quieres dar de baja a este paciente?")) return false;

    try {
        const res = await fetch(`/api/patients/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            return true 
        } else {
            throw new Error("Error al dar de baja al paciente");
        }
    } catch (e) {
        console.log(e);
        alert("Error al dar de baja al paciente");
    }

    return false;
}