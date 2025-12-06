# PowerShell script to set up Notion API token
# Run this script: .\setup-token.ps1

$token = "YOUR_NOTION_API_TOKEN_HERE"

# Set environment variable for current session
$env:NOTION_API_TOKEN = $token

# Save to user environment permanently (optional)
[System.Environment]::SetEnvironmentVariable('NOTION_API_TOKEN', $token, 'User')

Write-Host "✅ Notion API token configured!" -ForegroundColor Green
Write-Host ""
Write-Host "The token has been set for:" -ForegroundColor Cyan
Write-Host "  - Current PowerShell session" -ForegroundColor Gray
Write-Host "  - User environment (permanent)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Share a page with your integration" -ForegroundColor White
Write-Host "  2. Get the page ID from the URL" -ForegroundColor White
Write-Host "  3. Set NOTION_PARENT_PAGE_ID or use --parent-page-id option" -ForegroundColor White
Write-Host ""
Write-Host "Test it with:" -ForegroundColor Cyan
Write-Host "  npm run dev list --parent-page-id YOUR_PAGE_ID" -ForegroundColor Gray

