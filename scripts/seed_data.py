#!/usr/bin/env python3
"""Seed realistic compliance data for EvanAIRegPlatform."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from core.entity_manager import EntityManager

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "evanaireg.db")
em = EntityManager(DB_PATH)

# Ensure vortex-pay exists
em.create_entity("vortex-pay", "Vortex Pay", "Vortex Pay Inc.", "fintech")

# Jurisdictions
jurisdictions = [
    ("MX", "Mexico", "2023-03-15"),
    ("SG", "Singapore", "2024-01-10"),
    ("US", "United States", "2022-07-01"),
]
for code, name, date in jurisdictions:
    em.add_jurisdiction("vortex-pay", code, name, registered_date=date)

# Compliance Rules
rules = [
    ("AML_CFT", "Customer Due Diligence (CDD)", "MX", "HIGH"),
    ("AML_CFT", "Transaction Monitoring Threshold", "MX", "HIGH"),
    ("AML_CFT", "SAR Filing within 30 days", "MX", "CRITICAL"),
    ("DATA_PRIVACY", "Aviso de Privacidad", "MX", "MEDIUM"),
    ("LICENSING", "CNBV Card Issuer Registration", "MX", "HIGH"),
    ("TAX", "ISR Annual Return", "MX", "MEDIUM"),
    ("TRAVEL_RULE", "Cross-Border Validation", "SG", "HIGH"),
    ("CONSUMER_PROTECTION", "Cooling-Off Period", "SG", "MEDIUM"),
    ("KYC", "PEP/Sanctions Screening", "US", "HIGH"),
    ("REPORTING", "FinCEN Currency Transaction Report", "US", "MEDIUM"),
]
for rule_type, rule_name, jdx, severity in rules:
    em.add_rule("vortex-pay", rule_type, rule_name, jdx, severity)

# Thresholds
thresholds = [
    ("DAILY_TX_VOLUME", 500000, "MXN", "all", "MX"),
    ("MONTHLY_TX_VOLUME", 15000000, "MXN", "all", "MX"),
    ("SINGLE_TX_AMOUNT", 21000, "MXN", "retail", "MX"),
    ("PEP_SCREENING_AMOUNT", 10000, "USD", "all", "US"),
    ("SAR_THRESHOLD", 400000, "MXN", "all", "MX"),
]
for ttype, value, unit, applies, jdx in thresholds:
    em.add_threshold("vortex-pay", ttype, value, unit, applies, jdx)

print("Seeded vortex-pay with:")
print(f"  {len(jurisdictions)} jurisdictions")
print(f"  {len(rules)} compliance rules")
print(f"  {len(thresholds)} thresholds")
