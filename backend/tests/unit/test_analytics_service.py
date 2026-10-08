from datetime import datetime

from app.services.analytics_service import AnalyticsService


def test_get_storage_analytics_returns_storage_totals(
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="original.txt",
        size=100,
        status="original"
    )

    file_factory(
        user,
        filename="duplicate.txt",
        size=100,
        status="duplicate"
    )

    file_factory(
        user,
        filename="unique.txt",
        size=50,
        status="ready"
    )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id,
        largest_limit=10,
        recent_limit=10
    )

    assert analytics["total_files"] == 3
    assert analytics["total_storage"] == 250
    assert analytics["duplicate_files"] == 1
    assert analytics["duplicate_storage"] == 100
    assert analytics["potential_storage_savings"] == 100


def test_get_storage_analytics_returns_largest_files_in_descending_order(
    db,
    user,
    file_factory
):
    file_factory(
        user,
        filename="small.txt",
        size=50
    )

    large = file_factory(
        user,
        filename="large.txt",
        size=300
    )

    medium = file_factory(
        user,
        filename="medium.txt",
        size=200
    )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id,
        largest_limit=2,
        recent_limit=10
    )

    assert [
        item.id
        for item in analytics["largest_files"]
    ] == [
        large.id,
        medium.id
    ]


def test_get_storage_analytics_returns_recent_uploads_in_descending_order(
    db,
    user,
    file_factory
):
    oldest = file_factory(
        user,
        filename="oldest.txt",
        size=50,
        created_at=datetime(
            2026,
            1,
            1,
            10,
            0,
            0
        )
    )

    newest = file_factory(
        user,
        filename="newest.txt",
        size=50,
        created_at=datetime(
            2026,
            1,
            3,
            10,
            0,
            0
        )
    )

    middle = file_factory(
        user,
        filename="middle.txt",
        size=50,
        created_at=datetime(
            2026,
            1,
            2,
            10,
            0,
            0
        )
    )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id,
        largest_limit=10,
        recent_limit=2
    )

    assert [
        item.id
        for item in analytics["recent_uploads"]
    ] == [
        newest.id,
        middle.id
    ]

    assert oldest.id not in [
        item.id
        for item in analytics["recent_uploads"]
    ]


def test_get_storage_analytics_excludes_deleted_files(
    db,
    user,
    file_factory
):
    active = file_factory(
        user,
        filename="active.txt",
        size=100,
        status="ready"
    )

    file_factory(
        user,
        filename="deleted.txt",
        size=500,
        status="duplicate",
        is_deleted=True
    )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id
    )

    assert analytics["total_files"] == 1
    assert analytics["total_storage"] == 100
    assert analytics["duplicate_files"] == 0
    assert analytics["duplicate_storage"] == 0
    assert analytics["potential_storage_savings"] == 0

    assert [
        item.id
        for item in analytics["largest_files"]
    ] == [active.id]


def test_get_storage_analytics_isolated_by_user(
    db,
    user,
    second_user,
    file_factory
):
    file_factory(
        user,
        filename="user-one.txt",
        size=100
    )

    file_factory(
        second_user,
        filename="user-two.txt",
        size=500
    )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id
    )

    assert analytics["total_files"] == 1
    assert analytics["total_storage"] == 100

    assert all(
        item.original_filename == "user-one.txt"
        for item in analytics["largest_files"]
    )


def test_get_storage_analytics_respects_limits(
    db,
    user,
    file_factory
):
    for index in range(5):
        file_factory(
            user,
            filename=f"file-{index}.txt",
            size=100 + index
        )

    analytics = AnalyticsService(
        db
    ).get_storage_analytics(
        user_id=user.id,
        largest_limit=3,
        recent_limit=2
    )

    assert len(
        analytics["largest_files"]
    ) == 3

    assert len(
        analytics["recent_uploads"]
    ) == 2