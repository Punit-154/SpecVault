from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.routers import auth, products

app = FastAPI(title="SpecVault API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

'''
allow_methods - A list of HTTP methods that should be allowed for cross-origin requests.
Defaults to ['GET']. You can use ['*'] to allow all standard methods.
allow_headers - A list of HTTP request headers that should be supported for 
cross-origin requests. Defaults to []. You can use ['*'] to allow all headers.
The Accept, Accept-Language, Content-Language and Content-Type headers are always
allowed for simple CORS requests.
'''

app.include_router(auth.router)
app.include_router(products.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


'''
If asked "explain CORS" cold, a tight answer sounds like: 
"It's a header-based mechanism letting a server allow specific cross-origin 
reads of its responses, since browsers block that by default under the 
same-origin policy. Simple GET/POST requests with plain headers 
go straight through, gated only by Access-Control-Allow-Origin on the response.
Anything riskier — custom headers, JSON bodies, non-GET/POST methods — 
triggers a preflight OPTIONS request first, which the server must 
explicitly approve via Access-Control-Allow-Methods/-Headers before the 
real request is sent. And if you want cookies to ride along cross-origin, 
both sides have to opt in explicitly, and wildcards are disallowed once 
credentials are in play."
'''
