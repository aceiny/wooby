from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict

from schemas.institution import InstitutionResponse


class ConnectionStatus(str, Enum):
    ACTIVE = "active"
    SYNCING = "syncing"
    AUTH_REQUIRED = "auth_required"
    ERROR = "error"
    DISCONNECTED = "disconnected"


class ConnectionCreate(BaseModel):
    institution_id: int
    status: ConnectionStatus = ConnectionStatus.SYNCING


class ConnectionDelete(BaseModel):
    connection_id: int


class BankConnectionResponse(BaseModel):
    id: int
    user_id: int
    institution: InstitutionResponse
    status: ConnectionStatus
    last_synced_at: datetime | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
