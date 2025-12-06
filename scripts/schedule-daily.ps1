# PowerShell script to schedule daily template generation on Windows
# Run this script as Administrator to set up the scheduled task

$scriptPath = Join-Path $PSScriptRoot "daily-generate.js"
$projectPath = Split-Path -Parent $PSScriptRoot
$nodePath = (Get-Command node).Source

Write-Host "Setting up daily template generation task..." -ForegroundColor Blue

# Create scheduled task
$action = New-ScheduledTaskAction -Execute $nodePath -Argument "`"$scriptPath`"" -WorkingDirectory $projectPath
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

$taskName = "NotionTemplateDailyGeneration"

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Task already exists. Updating..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Automatically generate 10 Notion templates daily"

Write-Host "✅ Scheduled task created successfully!" -ForegroundColor Green
Write-Host "Task name: $taskName" -ForegroundColor Cyan
Write-Host "Runs daily at 9:00 AM" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view the task:" -ForegroundColor Yellow
Write-Host "  Get-ScheduledTask -TaskName $taskName" -ForegroundColor Gray
Write-Host ""
Write-Host "To remove the task:" -ForegroundColor Yellow
Write-Host "  Unregister-ScheduledTask -TaskName $taskName -Confirm:`$false" -ForegroundColor Gray

