$ErrorActionPreference = 'Stop'
$targetTotal = 1500
$tag = '// test-pr'

Write-Host "Scanning for .ts files..."
$ts = Get-ChildItem -Recurse -Filter *.ts | Where-Object { $_.FullName -notlike '*\node_modules\*' }

$existingTagged = 0
foreach ($f in $ts) {
    $first = (Get-Content -LiteralPath $f.FullName -TotalCount 1 -ErrorAction SilentlyContinue)
    if ($first -eq $tag) { $existingTagged++ }
}

$remaining = $targetTotal - $existingTagged
if ($remaining -lt 0) { $remaining = 0 }
Write-Host "Already tagged: $existingTagged; Remaining to tag: $remaining"

$modified = 0
if ($remaining -gt 0) {
    foreach ($f in $ts) {
        if ($modified -ge $remaining) { break }
        $first = (Get-Content -LiteralPath $f.FullName -TotalCount 1 -ErrorAction SilentlyContinue)
        if ($first -ne $tag) {
            $content = Get-Content -LiteralPath $f.FullName -Raw
            ($tag + "`r`n" + $content) | Set-Content -LiteralPath $f.FullName -Encoding UTF8
            $modified++
        }
    }
}

$finalTagged = 0
foreach ($f in $ts) {
    $first = (Get-Content -LiteralPath $f.FullName -TotalCount 1 -ErrorAction SilentlyContinue)
    if ($first -eq $tag) { $finalTagged++ }
}

Write-Host "Previously tagged: $existingTagged"
Write-Host "Newly tagged:      $modified"
Write-Host "Total tagged now:  $finalTagged"

if ($finalTagged -ne $targetTotal) {
    Write-Warning "Total tagged ($finalTagged) != target ($targetTotal). You may rerun the script or adjust target."
}