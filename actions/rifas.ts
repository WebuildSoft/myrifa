"use server"

import * as Create from "./rifa/create"
import * as Update from "./rifa/update"
import * as Status from "./rifa/status"

/**
 * These wrappers are necessary to satisfy the Next.js requirement that 
 * "use server" files only export async functions, even when re-exporting.
 */

export async function createRifaAction(formData: FormData) {
    return Create.createRifaAction(formData)
}

export async function updateRifaConfigAction(rifaId: string, data: { isPrivate?: boolean, drawDate?: string, minPercentToRaffle?: number }) {
    return Update.updateRifaConfigAction(rifaId, data)
}

export async function updateRifaAction(rifaId: string, formData: FormData) {
    return Update.updateRifaAction(rifaId, formData)
}

export async function publishRifaAction(rifaId: string) {
    return Status.publishRifaAction(rifaId)
}

export async function encerrarVendasAction(rifaId: string) {
    return Status.encerrarVendasAction(rifaId)
}

export async function cancelarRifaAction(rifaId: string) {
    return Status.cancelarRifaAction(rifaId)
}

export async function deleteRifaAction(rifaId: string) {
    return Status.deleteRifaAction(rifaId)
}
