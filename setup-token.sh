#!/bin/bash
# Bash script to set up Notion API token
# Run this script: source setup-token.sh

export NOTION_API_TOKEN="YOUR_NOTION_API_TOKEN_HERE"

echo "✅ Notion API token configured!"
echo ""
echo "The token has been set for the current shell session."
echo ""
echo "To make it permanent, add this to your ~/.bashrc or ~/.zshrc:"
echo "  export NOTION_API_TOKEN=\"YOUR_NOTION_API_TOKEN_HERE\""
echo ""
echo "Next steps:"
echo "  1. Share a page with your integration"
echo "  2. Get the page ID from the URL"
echo "  3. Set NOTION_PARENT_PAGE_ID or use --parent-page-id option"
echo ""
echo "Test it with:"
echo "  npm run dev list --parent-page-id YOUR_PAGE_ID"

