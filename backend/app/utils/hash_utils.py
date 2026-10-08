import hashlib
from pathlib import Path


def calculate_sha256(
    file_path: str | Path,
    chunk_size: int = 1024 * 1024
) -> str:
    sha256 = hashlib.sha256()

    with Path(file_path).open("rb") as file:
        while True:
            chunk = file.read(chunk_size)

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()