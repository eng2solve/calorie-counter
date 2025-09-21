import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from ..config import RATE_LIMIT_PER_MINUTE

class SimpleRateLimiter(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiter per IP.
        """
    def __init__(self, app):
        super().__init__(app)
        self.calls = {} 
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = 60  # seconds
        max_calls = RATE_LIMIT_PER_MINUTE or 2

        timestamps = self.calls.get(ip, [])
        # keeping timestamp
        timestamps = [t for t in timestamps if now - t < window]
        if len(timestamps) >= max_calls:
            raise HTTPException(status_code=429, detail=f"Too many requests. Limit is {max_calls}/minute.")
        timestamps.append(now)
        self.calls[ip] = timestamps

        response = await call_next(request)
        return response
