from pydantic import BaseModel, ConfigDict, Field, field_validator

from common.validators.string_validators import validate_name

class InstitutionCreate(BaseModel) : 
    name: str = Field(
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-ZÀ-ÿ\s'-]+$"
    )
    description : str = Field(
        min_length=3,
        max_length=200,
        pattern=r"^[a-zA-ZÀ-ÿ\s'-]+$"
    )
    @field_validator("name") 
    @classmethod
    def valide_name(cls , value : str) -> str : 
        return validate_name(value)
    
    
class InstitutionResponse(BaseModel) : 
    id : int
    name : str 
    description : str 
    slug : str 
    
    model_config = ConfigDict(from_attributes=True)
    