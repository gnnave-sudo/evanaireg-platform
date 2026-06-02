"""Simple document parser for ingestion pipeline."""
import re
import json
from typing import List, Dict, Any


def split_sentences(text: str) -> List[str]:
    """Split text into sentences."""
    # Simple regex-based sentence splitting
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]


def extract_keywords(text: str, top_n: int = 10) -> List[str]:
    """Extract frequent keywords (simple TF approach)."""
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    stopwords = {'this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'there', 'would', 'should', 'could', 'about', 'which', 'when', 'where', 'what', 'than', 'more', 'some', 'time', 'very', 'after', 'most', 'made', 'many', 'over', 'such', 'take', 'than', 'only', 'also', 'into', 'just', 'like', 'these', 'them', 'well', 'were', 'said', 'each', 'other', 'will', 'much', 'then', 'than', 'only', 'come', 'its', 'may', 'say', 'way', 'she', 'him', 'has', 'had', 'how', 'her', 'his', 'but', 'not', 'are', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'}
    filtered = [w for w in words if w not in stopwords]
    from collections import Counter
    return [w for w, _ in Counter(filtered).most_common(top_n)]


def extract_entities(text: str) -> List[Dict[str, str]]:
    """Extract simple entity mentions (capitalized phrases)."""
    pattern = r'\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b'
    matches = re.findall(pattern, text)
    seen = set()
    entities = []
    for match in matches:
        name = match.strip()
        if name not in seen and len(name) > 3:
            seen.add(name)
            entities.append({"name": name, "type": "ORG" if any(k in name.lower() for k in ['inc', 'corp', 'ltd', 'llc', 'bank', 'fund']) else "MISC"})
    return entities[:20]


def parse_document(text: str, title: str = "") -> Dict[str, Any]:
    """Parse a document and return structured metadata."""
    sentences = split_sentences(text)
    words = text.split()
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]

    result = {
        "title": title,
        "word_count": len(words),
        "sentence_count": len(sentences),
        "paragraph_count": len(paragraphs),
        "sentences": sentences[:50],  # limit storage
        "keywords": extract_keywords(text),
        "entities": extract_entities(text),
        "language": "en",  # simplified
    }

    # Try to detect jurisdiction references
    jurisdiction_keywords = {
        "mx": ["mexico", "cnbv", "lfpiorpi", "sat", "uif", "mxn"],
        "sg": ["singapore", "mas", "sgd", "monetary authority"],
        "us": ["united states", "sec", "finra", "usd", "treasury"],
        "uk": ["united kingdom", "fca", "gbp", "financial conduct"],
        "hk": ["hong kong", "sfc", "hkd", "securities and futures"],
    }
    text_lower = text.lower()
    detected_jurisdictions = []
    for code, keywords in jurisdiction_keywords.items():
        if any(kw in text_lower for kw in keywords):
            detected_jurisdictions.append(code)
    result["detected_jurisdictions"] = detected_jurisdictions

    return result


def summarize_document(text: str, llm_client=None) -> str:
    """Generate a summary using LLM if available, otherwise return first sentences."""
    if llm_client and llm_client.is_available():
        try:
            prompt = f"Summarize the following regulatory document in 2-3 sentences:\n\n{text[:4000]}"
            return llm_client.generate(prompt, system="You are a regulatory analyst. Summarize documents concisely.")
        except Exception:
            pass
    sentences = split_sentences(text)
    return " ".join(sentences[:3]) if sentences else text[:200]
