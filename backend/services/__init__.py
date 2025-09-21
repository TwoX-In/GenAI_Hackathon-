"""Services package for the Artisan Assistant backend."""

# Re-export artisan_agent components for easy access
from .artisan_agent import (
    artisan_client
)

__all__ = [
    'artisan_client',
] 