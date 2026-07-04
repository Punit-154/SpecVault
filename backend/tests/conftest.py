import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_KEY"] = "test-key"
os.environ["SUPABASE_JWT_SECRET"] = "test-secret"

from src.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_supabase(monkeypatch):
    mock_client = MagicMock()
    monkeypatch.setattr("src.routers.auth.supabase", mock_client)
    monkeypatch.setattr("src.routers.products.supabase", mock_client)
    return mock_client
