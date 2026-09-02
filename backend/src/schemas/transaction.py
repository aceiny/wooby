from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    account_id: int
    amount: Decimal
    currency: str
    label: str
    date: date
    category: str | None = None
