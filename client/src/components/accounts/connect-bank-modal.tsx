"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Landmark, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractErrorMessage } from "@/lib/utils/error.utils";
import { getBankConfig } from "@/lib/bank-config";
import {
  useInstitutions,
  useConnections,
  useConnectBank,
} from "@/hooks/use-accounts";
import type { Institution } from "@/types/api.types";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectBankModal({ isOpen, onClose }: ConnectBankModalProps) {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  const { data: institutions, isLoading: isInstitutionsLoading } = useInstitutions();
  const { data: connections } = useConnections();
  const connectMutation = useConnectBank();

  // Create a set of connected institution IDs and slugs for fast lookup
  const connectedSlugs = new Set(connections?.map((c) => c.institution.slug));
  const connectedIds = new Set(connections?.map((c) => c.institution.id).filter(Boolean));

  const handleConnect = () => {
    if (!selectedInstitution) return;
    // Pass institution ID if available, otherwise slug
    const target = selectedInstitution.id ?? selectedInstitution.slug;
    connectMutation.mutate(target as any, {
      onSuccess: () => {
        setSelectedInstitution(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!connectMutation.isPending) {
      setSelectedInstitution(null);
      connectMutation.reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <span>Connect a bank</span>
          </div>
          <p className="text-sm font-normal text-muted-foreground">
            Choose a bank from available institutions to connect
          </p>
        </ModalHeader>

        <ModalBody>
          {connectMutation.isError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                {extractErrorMessage(connectMutation.error, "Failed to connect bank. Please try again.")}
              </p>
            </div>
          )}

          {isInstitutionsLoading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-20 animate-pulse items-center gap-4 rounded-xl border border-border bg-muted/40 p-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 rounded bg-muted" />
                    <div className="h-3 w-44 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {institutions && institutions.length > 0 ? (
                institutions.map((inst) => {
                  const bankConfig = getBankConfig(inst.slug);
                  const isConnected =
                    connectedSlugs.has(inst.slug) ||
                    (inst.id !== undefined && connectedIds.has(inst.id));
                  const isSelected = selectedInstitution?.slug === inst.slug;

                  const color = bankConfig?.color || "#6366f1";
                  const name = inst.name || bankConfig?.name || inst.slug;
                  const description = inst.description || bankConfig?.description || "";
                  const shortName = bankConfig?.shortName || name.slice(0, 3);

                  return (
                    <button
                      key={inst.slug || inst.id}
                      onClick={() => !isConnected && setSelectedInstitution(inst)}
                      disabled={isConnected || connectMutation.isPending}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-150",
                        isConnected
                          ? "border-border/60 bg-muted/30 opacity-70 cursor-not-allowed"
                          : isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/30 cursor-pointer"
                      )}
                    >
                      {/* Bank logo/badge */}
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {shortName.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">{name}</p>
                          {isConnected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{description}</p>
                      </div>

                      {/* Selection indicator */}
                      {!isConnected && isSelected && (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No institutions available at the moment.
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={handleClose}
            isDisabled={connectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleConnect}
            isDisabled={!selectedInstitution}
            isLoading={connectMutation.isPending}
          >
            {connectMutation.isPending ? "Connecting..." : "Connect"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
