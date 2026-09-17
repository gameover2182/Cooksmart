"""
Genera un hash bcrypt a partir de una contraseña en texto plano.
Uso: python generar_hash.py "MiContraseñaDePrueba123!"

Este script es solo para poblar datos de PRUEBA (seed). En la aplicación
real, el hashing debe hacerlo el propio backend en el momento del
registro (RF01), nunca a mano ni en un script aparte.
"""

import sys
from importlib import import_module

bcrypt = import_module("bcrypt")

def generar_hash(password: str, cost_factor: int = 12) -> str:
    salt = bcrypt.gensalt(rounds=cost_factor)
    hash_bytes = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hash_bytes.decode("utf-8")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Uso: python generar_hash.py "contraseña"')
        sys.exit(1)

    password = sys.argv[1]
    hash_resultante = generar_hash(password)
    print(f"Contraseña:  {password}")
    print(f"Hash bcrypt: {hash_resultante}")
