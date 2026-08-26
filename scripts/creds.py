"""
creds.py — Resolve onde vive uma credencial local.

As credenciais saíram da pasta do Google Drive (que sincroniza e é
compartilhável) para um cofre em disco local com permissão 600.

Ordem de busca:
  1. $DAEDALUS_CREDS_DIR       — override explícito
  2. ~/.config/daedalus/alphafono  — cofre padrão
  3. pasta atual               — compatibilidade com o uso antigo
"""

import os
from pathlib import Path

VAULT = Path.home() / ".config" / "daedalus" / "alphafono"


def find(nome: str) -> Path:
    """Devolve o caminho da credencial `nome`. Não garante que exista."""
    override = os.environ.get("DAEDALUS_CREDS_DIR")
    candidatos = ([Path(override)] if override else []) + [VAULT, Path.cwd()]

    for pasta in candidatos:
        caminho = pasta / nome
        if caminho.exists():
            return caminho

    return VAULT / nome  # não achou: devolve o padrão, para a mensagem de erro
