def validate_match(
    value: str,
    other: str,
    error_text: str = "Values do not match",
) -> None:
    if value != other:
        raise ValueError(error_text)
    
def validate_name(
    value : str,
    error_text: str = "Name cannot be empty",
) -> None:
    value = value.strip()
    if not value:
        raise ValueError(error_text)
    return value