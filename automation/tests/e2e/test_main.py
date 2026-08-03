import pytest
from unittest.mock import patch, MagicMock

@patch('modules.image.generate_and_upload_image')
@patch('modules.strapi_client.create_blog_post')
@patch('modules.strapi_client.check_slug')
@patch('modules.strapi_client.verify_live')
@patch('modules.groq_llm.generate_blog_and_seo')
@patch('modules.market_data.get_market_data')
@patch('modules.serper.search_google')
@patch('modules.dedupe.is_topic_tracked')
@patch('modules.sheets.GoogleSheetsManager.update_status')
@patch('modules.sheets.GoogleSheetsManager.log_result')
@patch('modules.sheets.GoogleSheetsManager.get_pending_topics')
def test_main_e2e_successful_run(
    mock_get_pending_topics,
    mock_log_result,
    mock_update_status,
    mock_is_topic_tracked,
    mock_search_google,
    mock_get_market_data,
    mock_generate_blog,
    mock_verify_live,
    mock_check_slug,
    mock_create_blog_post,
    mock_generate_image
):
    # Setup mocks
    mock_get_pending_topics.return_value = [
        {"row": 2, "topic": "Bitcoin airdrop", "status": ""}
    ]
    mock_is_topic_tracked.return_value = False
    mock_search_google.return_value = [{"title": "News", "snippet": "...", "link": "http://news"}]
    mock_get_market_data.return_value = [{"title": "Market", "snippet": "...", "link": "http://market"}]
    mock_generate_blog.return_value = {
        "title": "Bitcoin Airdrop Guide",
        "slug": "bitcoin-airdrop-guide",
        "html": "<p>Content</p>",
        "faqs": [],
        "faqSchema": "",
        "category": "Bitcoin",
        "seo": {"meta_title": "Bitcoin Airdrop"}
    }
    mock_check_slug.return_value = True
    mock_generate_image.return_value = "media_123"
    mock_create_blog_post.return_value = True
    mock_verify_live.return_value = False # Auto publish is false by default
    
    from main import main
    main()
    
    # Assertions to ensure end-to-end flow worked
    mock_get_pending_topics.assert_called_once()
    mock_is_topic_tracked.assert_called_once_with("Bitcoin airdrop")
    mock_search_google.assert_called_once_with("Bitcoin airdrop")
    mock_get_market_data.assert_called_once_with("Bitcoin airdrop")
    mock_generate_blog.assert_called_once()
    mock_check_slug.assert_called_once_with("bitcoin-airdrop-guide")
    mock_generate_image.assert_called_once_with("Bitcoin airdrop", slug="bitcoin-airdrop-guide")
    mock_create_blog_post.assert_called_once()
    
    # Since AUTO_PUBLISH is false, status should be "Drafted, pending review"
    mock_update_status.assert_called_with(2, "Drafted, pending review")
    mock_log_result.assert_called_once()

@patch('modules.sheets.GoogleSheetsManager.get_pending_topics')
def test_main_no_topics(mock_get_pending_topics):
    mock_get_pending_topics.return_value = []
    
    from main import main
    main()
    
    # Run should exit early
    mock_get_pending_topics.assert_called_once()
