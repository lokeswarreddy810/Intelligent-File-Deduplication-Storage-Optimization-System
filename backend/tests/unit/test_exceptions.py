import logging

import pytest
from fastapi import Request

from app.core.exceptions import global_exception_handler


def create_request(
    method: str = "GET",
    path: str = "/test"
) -> Request:
    scope = {
        "type": "http",
        "method": method,
        "path": path,
        "headers": [],
        "query_string": b""
    }

    return Request(scope)


@pytest.mark.asyncio
async def test_global_exception_handler_returns_internal_server_error():
    request = create_request(
        method="GET",
        path="/test"
    )

    exception = RuntimeError(
        "test internal exception"
    )

    response = await global_exception_handler(
        request,
        exception
    )

    assert response.status_code == 500

    assert response.body == (
        b'{"success":false,"message":"An unexpected internal '
        b'server error occurred"}'
    )


@pytest.mark.asyncio
async def test_global_exception_handler_does_not_expose_exception_details():
    request = create_request(
        method="POST",
        path="/api/v1/test"
    )

    exception = RuntimeError(
        "sensitive internal database information"
    )

    response = await global_exception_handler(
        request,
        exception
    )

    response_body = response.body.decode()

    assert response.status_code == 500
    assert "sensitive internal database information" not in response_body
    assert "unexpected internal server error" in response_body


@pytest.mark.asyncio
async def test_global_exception_handler_logs_exception(
    caplog
):
    request = create_request(
        method="GET",
        path="/api/v1/test"
    )

    exception = RuntimeError(
        "test exception for logging"
    )

    with caplog.at_level(
        logging.ERROR,
        logger="app.core.exceptions"
    ):
        response = await global_exception_handler(
            request,
            exception
        )

    assert response.status_code == 500

    assert (
        "Unhandled exception while processing GET /api/v1/test"
        in caplog.text
    )

    assert "test exception for logging" in caplog.text
    assert "RuntimeError" in caplog.text