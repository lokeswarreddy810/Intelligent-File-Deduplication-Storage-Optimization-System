import hashlib

from app.utils.hash_utils import calculate_sha256


def test_calculate_sha256_returns_expected_hash(sample_file):
    expected_hash = hashlib.sha256(
        sample_file.read_bytes()
    ).hexdigest()

    result = calculate_sha256(sample_file)

    assert result == expected_hash


def test_calculate_sha256_returns_64_character_hex_value(
    sample_file
):
    result = calculate_sha256(sample_file)

    assert len(result) == 64

    assert all(
        character in "0123456789abcdef"
        for character in result
    )


def test_calculate_sha256_handles_empty_file(tmp_path):
    empty_file = tmp_path / "empty.txt"
    empty_file.write_bytes(b"")

    result = calculate_sha256(empty_file)

    expected_hash = hashlib.sha256(b"").hexdigest()

    assert result == expected_hash


def test_calculate_sha256_supports_small_chunks(sample_file):
    expected_hash = hashlib.sha256(
        sample_file.read_bytes()
    ).hexdigest()

    result = calculate_sha256(
        sample_file,
        chunk_size=4
    )

    assert result == expected_hash