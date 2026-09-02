from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    connection_id: int
    name: str
    type: str
    currency: str
    balance: Decimal
