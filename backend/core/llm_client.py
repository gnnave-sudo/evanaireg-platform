"""Ollama LLM client for EvanAIRegPlatform."""
import os
import httpx
from typing import Optional

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen3.6:35b-a3b")


class LLMClient:
    def __init__(self, host: Optional[str] = None, model: Optional[str] = None):
        self.host = host or OLLAMA_HOST
        self.model = model or OLLAMA_MODEL
        self.client = httpx.Client(base_url=self.host, timeout=120.0)

    def generate(self, prompt: str, system: Optional[str] = None) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }
        if system:
            payload["system"] = system
        resp = self.client.post("/api/generate", json=payload)
        resp.raise_for_status()
        return resp.json().get("response", "").strip()

    def chat(self, messages: list[dict]) -> str:
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
        }
        resp = self.client.post("/api/chat", json=payload)
        resp.raise_for_status()
        return resp.json().get("message", {}).get("content", "").strip()

    def is_available(self) -> bool:
        try:
            resp = self.client.get("/api/tags", timeout=5.0)
            return resp.status_code == 200
        except Exception:
            return False


def get_llm() -> LLMClient:
    return LLMClient()
