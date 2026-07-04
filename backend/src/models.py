from datetime import datetime
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0, lt=100000)
    specs: dict[str, str] = Field(default_factory=dict)
    source_url: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    brand: str | None = Field(None, min_length=1, max_length=100)
    category: str | None = Field(None, min_length=1, max_length=100)
    price: float | None = Field(None, gt=0, lt=100000)
    specs: dict[str, str] | None = None
    source_url: str | None = None


class ProductResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    brand: str
    category: str
    price: float
    specs: dict[str, str] = Field(default_factory=dict)
    source_url: str | None = None
    created_at: str


class PaginatedResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int


class SignupRequest(BaseModel):
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user_id: str
    email: str


class UserResponse(BaseModel):
    id: str
    email: str
