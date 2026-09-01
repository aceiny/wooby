from dataclasses import dataclass

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from common.validators.string_validators import validate_match, validate_name

@dataclass
class UserIdentifier:
    id: int | None = None
    email: EmailStr | None = None

class UserCreate(BaseModel) : 
    name : str = Field(
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-ZÀ-ÿ\s'-]+$"
    )
    email : EmailStr
    password : str = Field(
        min_length=8,
        max_length=128        
    )
    password_confirmation : str = Field(
        min_length=8,
        max_length=128        
    )
    
    @field_validator("name")
    @classmethod
    def valide_name(cls , value : str) -> str : 
        return validate_name(value)
    
    @model_validator(mode="after")
    def password_match(self) : 
        validate_match(
            self.password,
            self.password_confirmation,
            "Passwords do not match",
        )
        return self
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    
    model_config = {
        "from_attributes": True
    }