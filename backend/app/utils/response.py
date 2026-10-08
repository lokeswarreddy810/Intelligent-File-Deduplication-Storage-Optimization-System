def success_response(
    data=None,
    message: str = "Operation completed successfully"
) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data
    }