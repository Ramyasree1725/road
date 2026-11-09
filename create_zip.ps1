
$curr = Get-Location;
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem') | Out-Null;
$zipPath = [System.IO.Path]::Combine($curr.Path, 'submission_ready.zip');
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create');
Get-ChildItem -Path $curr.Path -Recurse -Force | Where-Object {
    $_.FullName -notmatch 'submission_ready\.zip' -and
    $_.FullName -notmatch '\.zip$' -and
    $_.FullName -notmatch '\\node_modules(\\|$)' -and
    $_.FullName -notmatch '\\.env' -and
    $_.FullName -notmatch '\\enterprise_codebase'
} | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $rel = $_.FullName.Substring($curr.Path.Length + 1);
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel)
    }
};
$zip.Dispose();
$sizeMb = ((Get-Item $zipPath).Length / 1MB).ToString('0.00');
Write-Host "✅ Created submission_ready.zip: $sizeMb MB"
