import math
from fastapi import APIRouter, Depends, HTTPException, Query, status
from src.database import supabase
from src.models import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    PaginatedResponse,
)
from src.middleware.auth import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])

#NOTE: id is well the product's id
#WHEREAS user[id] and "owner_id" is the user
def _row_to_response(row: dict) -> ProductResponse:
    specs = row.get("specs") or {}
    if isinstance(specs, str):
        import json
        specs = json.loads(specs)
    return ProductResponse(
        id=row["id"],
        owner_id=row["owner_id"],
        name=row["name"],
        brand=row["brand"],
        category=row["category"],
        price=float(row["price"]),
        specs=specs,
        source_url=row.get("source_url"),
        created_at=row["created_at"],
    )


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(body: ProductCreate, user: dict = Depends(get_current_user)):
    data = {
        "owner_id": user["id"],
        "name": body.name,
        "brand": body.brand,
        "category": body.category,
        "price": body.price,
        "specs": body.specs,
        "source_url": body.source_url,
    }
    result = supabase.table("products").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return _row_to_response(result.data[0])


@router.get("", response_model=PaginatedResponse)
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = Query(None, min_length=1),
):
    query = supabase.table("products").select("*", count="exact")

    if search:
        query = query.ilike("name", f"%{search}%")

    total_result = query.execute()
    total = total_result.count or 0
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit

    result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()

    items = [_row_to_response(row) for row in result.data]
    return PaginatedResponse(
        items=items, total=total, page=page, limit=limit, pages=pages
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    result = supabase.table("products").select("*").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return _row_to_response(result.data[0])


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    existing = supabase.table("products").select("owner_id").eq("id", product_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")
    if existing.data[0]["owner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    supabase.table("products").delete().eq("id", product_id).execute()
    return None


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str, body: ProductUpdate, user: dict = Depends(get_current_user)
):
    existing = supabase.table("products").select("*").eq("id", product_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")
    if existing.data[0]["owner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")

    update_data = body.model_dump(exclude_unset=True)
    if not update_data:
        return _row_to_response(existing.data[0])

    result = supabase.table("products").update(update_data).eq("id", product_id).execute()
    return _row_to_response(result.data[0])
