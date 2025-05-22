from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.db.init_db import  init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CardBill API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS
origins = [
    "http://localhost:3000",  # Frontend URL

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include all API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    """
    Initialize application on startup
    """
    # Create first admin user if doesn't exist
    await init_db()
    # await create_first_admin()

@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint for health check
    """
    return JSONResponse(
        status_code=200,
        content={"message": "Card Bill API is running"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)