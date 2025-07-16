# compress-pngs.ps1
Write-Host "Running script from: $PSCommandPath"
$pngquantPath = "C:\pngquant\pngquant.exe"
Write-Host "Using pngquant at: $pngquantPath"

# REMOVE or comment out this line 👇
# cd public

$pngFiles = Get-ChildItem -Path . -Filter *.png -Recurse

foreach ($file in $pngFiles) {
    & $pngquantPath --quality=80-100 --ext .png --force "$($file.FullName)"
}

Write-Host "Compression complete. All PNGs have been optimized and replaced."
