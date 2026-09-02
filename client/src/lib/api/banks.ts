import internalAPI from "./client";
import type { BankConnection, Institution } from "@/types/api.types";
import { ConnectionStatus } from "@/types/api.types";

export const banksApi = {
  /**
   * Fetch list of supported financial institutions from FastAPI backend
   */
  getInstitutions: async (): Promise<Institution[]> => {
    const res = await internalAPI.get<Institution[]>("/institutions");
    return res.data;
  },

  /**
   * Fetch connected bank accounts for current authenticated user from FastAPI backend
   */
  getConnections: async (): Promise<BankConnection[]> => {
    const res = await internalAPI.get<BankConnection[]>("/connections");
    return res.data;
  },

  /**
   * Fetch details of a specific bank connection by ID
   */
  getConnection: async (id: number): Promise<BankConnection> => {
    const res = await internalAPI.get<BankConnection>(`/connections/${id}`);
    return res.data;
  },

  /**
   * Connect a new bank account via FastAPI backend
   * Accepts either an institutionId directly or institutionSlug (looking up institution ID)
   */
  connect: async (institutionSlugOrId: string | number): Promise<BankConnection> => {
    let institutionId: number;

    if (typeof institutionSlugOrId === "number") {
      institutionId = institutionSlugOrId;
    } else {
      // Fetch institutions to match slug to ID
      const institutions = await banksApi.getInstitutions();
      const match = institutions.find((inst) => inst.slug === institutionSlugOrId);
      if (!match || !match.id) {
        throw new Error(`Institution '${institutionSlugOrId}' not found`);
      }
      institutionId = match.id;
    }

    const res = await internalAPI.post<BankConnection>("/connections", {
      institution_id: institutionId,
      status: ConnectionStatus.ACTIVE,
    });
    return res.data;
  },

  /**
   * Disconnect a bank account via FastAPI backend
   */
  disconnect: async (connectionId: number): Promise<void> => {
    await internalAPI.delete(`/connections/${connectionId}`);
  },

  /**
   * Synchronize a bank connection
   */
  sync: async (connectionId: number): Promise<BankConnection> => {
    // Backend connection endpoint returns the updated connection state
    const res = await internalAPI.get<BankConnection>(`/connections/${connectionId}`);
    return res.data;
  },
};
