# Script para corrigir imports nos componentes
$files = Get-ChildItem -Path "src\app\modules" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace "\.\.\/\.\.\/\.\.\/services", "\.\.\/\.\.\/\.\.\/\.\.\/services"
    $content = $content -replace "\.\.\/\.\.\/\.\.\/models", "\.\.\/\.\.\/\.\.\/\.\.\/models"
    $content = $content -replace "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/services", "\.\.\/\.\.\/\.\.\/\.\.\/services"
    $content = $content -replace "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/models", "\.\.\/\.\.\/\.\.\/\.\.\/models"
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Imports corrigidos!"
