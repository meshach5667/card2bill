from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str


class LoginRequest(BaseModel):
    email:EmailStr
    password: str
    

class LoginResponse(Token):
    user_id: str
    is_admin: bool
    # username: str
    email: str