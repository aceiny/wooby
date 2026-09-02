from schemas.connection import ConnectionStatus
from services.institution_service import build_slug


def test_build_slug_normalizes_institution_name():
    assert build_slug("Bank of America") == "bank-of-america"
    assert build_slug("  Société Générale  ") == "societe-generale"


def test_connection_status_defaults_to_syncing():
    assert ConnectionStatus.SYNCING.value == "syncing"
