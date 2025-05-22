from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, crypto, gift_cards, withdrawals, chat, vtu, admin

api_router = APIRouter()

# User routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(crypto.router, prefix="/crypto", tags=["Cryptocurrency"])
api_router.include_router(gift_cards.router, prefix="/gift-cards", tags=["Gift Cards"])
api_router.include_router(withdrawals.router, prefix="/withdrawals", tags=["Withdrawals"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat Support"])
api_router.include_router(vtu.router, prefix="/vtu", tags=["VTU Services"])

# Admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])